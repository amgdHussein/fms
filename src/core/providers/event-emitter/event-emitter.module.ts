import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule as NestEventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';

import { EVENT_EMITTER_PROVIDER } from '../../constants';

@Module({})
export class EventEmitterModule {
  /**
   * A description of the entire function.
   *
   * @param {EventEmitterModuleOptions} options - description of parameter
   * @return {DynamicModule} targetModule
   */
  static forRoot(options: EventEmitterModuleOptions): DynamicModule {
    const eventEmitterProvider: Provider = {
      provide: EVENT_EMITTER_PROVIDER,
      useFactory: (): EventEmitter2 => new EventEmitter2(),
    };

    const targetModule: DynamicModule = {
      global: true,
      imports: [NestEventEmitterModule.forRoot(options)],
      providers: [eventEmitterProvider],
      exports: [eventEmitterProvider],
      module: EventEmitterModule,
    };

    return targetModule;
  }
}
