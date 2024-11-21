import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts the incoming request and logs relevant information.
   * Creates informative logs for all requests, showing the path,
   * the method name, user id, called handler, and time taken to execute the request.
   *
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {CallHandler} next - The next handler in the chain.
   * @return {Observable<void>} An observable that completes when the request is handled.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const now = Date.now();
    const contextType = context.getType() as string;

    switch (contextType) {
      case 'http': {
        const httpContext: HttpArgumentsHost = context.switchToHttp();
        const request = httpContext.getRequest();
        const userAgent = request.get('user-agent') || 'none';
        const { ip, method, path, body } = request;

        // To view incoming request
        this.logger.log(`Incoming HTTP Request on ${path}`);

        // To view request data as method, agent, ip, and handler
        const data = body ? JSON.stringify(body) : 'None';
        this.logger.debug(`method=${method} userAgent=${userAgent} ip=${ip}: handler=${context.getClass().name}.${context.getHandler().name} data=${data}`);

        return next.handle().pipe<void>(
          tap({
            next: (): void => {
              // To log the result of the request
              this.logger.debug(`statusCode=${httpContext.getResponse().statusCode} duration +${Date.now() - now}ms`);
            },

            error: (exception): void => {
              // TODO: USE HttpException FOR ERROR HANDLING
              const cause = exception.response?.message || exception?.cause;
              const message = exception.message || exception;

              // To log the error of the request
              this.logger.error(
                `statusCode=${exception.status} error="${message}" cause="${[cause].flat().join(', ')}"`,
                `Error Stack: ${exception.stack || ''}`,
              );
            },

            complete: (): void => {
              // Log the end of the request
              this.logger.log(`End HTTP Request for ${path}`);
            },
          }),
        );
      }
    }
  }
}
