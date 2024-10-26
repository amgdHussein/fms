import { ArgumentsHost, Catch, HttpException, HttpStatus, Injectable, ExceptionFilter as NestExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Injectable()
@Catch(HttpException)
export class ExceptionFilter implements NestExceptionFilter<HttpException> {
  /**
   * Handles the caught exception and sends an appropriate JSON response.
   *
   * @param {HttpException} exception - the caught exception
   * @param {ArgumentsHost} host - the arguments host
   * @return {void}
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response: Response = context.getResponse<Response>();
    const request: Request = context.getRequest<Request>();

    if (exception instanceof HttpException) {
      // Get the cause of the error (custom exception or validation pipe exception)
      const status: number = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const message: string = exception.message;
      const httpResponse: any = exception.getResponse();
      const cause: unknown = exception.cause || httpResponse?.message;

      const body: any = {
        statusCode: status,
        message: message,
        method: request.method,
        path: request.url,
        timestamp: new Date().toISOString(),
      };

      if (cause) body.cause = cause;

      response.status(status).json(body);
    }
  }
}
