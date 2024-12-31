import { Global, Module } from '@nestjs/common';

import { GetEvents, GetLogs } from './application';
import {
  EVENT_REPOSITORY_PROVIDER,
  EVENT_SERVICE_PROVIDER,
  EVENT_USECASE_PROVIDERS,
  LOG_REPOSITORY_PROVIDER,
  LOG_SERVICE_PROVIDER,
  LOG_USECASE_PROVIDERS,
} from './domain';
import { EventFirestoreRepository, EventService, LogFirestoreRepository, LogService } from './infrastructure';
import { EventController, LogController } from './presentation';

const loggingUsecases = [
  {
    provide: LOG_USECASE_PROVIDERS.GET_LOGS,
    useClass: GetLogs,
  },
  {
    provide: EVENT_USECASE_PROVIDERS.GET_EVENTS,
    useClass: GetEvents,
  },
];

@Global()
@Module({
  controllers: [LogController, EventController],
  providers: [
    {
      provide: LOG_REPOSITORY_PROVIDER,
      useClass: LogFirestoreRepository,
    },
    {
      provide: LOG_SERVICE_PROVIDER,
      useClass: LogService,
    },
    {
      provide: EVENT_REPOSITORY_PROVIDER,
      useClass: EventFirestoreRepository,
    },
    {
      provide: EVENT_SERVICE_PROVIDER,
      useClass: EventService,
    },
    ...loggingUsecases,
  ],
  exports: [
    {
      provide: LOG_SERVICE_PROVIDER,
      useClass: LogService,
    },
    {
      provide: EVENT_SERVICE_PROVIDER,
      useClass: EventService,
    },
  ],
})
export class LoggingModule {}
