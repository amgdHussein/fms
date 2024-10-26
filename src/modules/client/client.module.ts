import { Module } from '@nestjs/common';

import { AddClient, AddClients, DeleteClient, GetClient, IsClientExistConstraint, QueryClients, UpdateClient } from './application';
import { CLIENT_REPOSITORY_PROVIDER, CLIENT_SERVICE_PROVIDER, CLIENT_USECASE_PROVIDERS } from './domain';
import { ClientFirestoreRepository, ClientService } from './infrastructure';
import { ClientController } from './presentation';

const validators = [IsClientExistConstraint];
const clientUsecases = [
  {
    provide: CLIENT_USECASE_PROVIDERS.GET_CLIENT,
    useClass: GetClient,
  },
  {
    provide: CLIENT_USECASE_PROVIDERS.ADD_CLIENT,
    useClass: AddClient,
  },
  {
    provide: CLIENT_USECASE_PROVIDERS.ADD_CLIENTS,
    useClass: AddClients,
  },
  {
    provide: CLIENT_USECASE_PROVIDERS.UPDATE_CLIENT,
    useClass: UpdateClient,
  },
  {
    provide: CLIENT_USECASE_PROVIDERS.QUERY_CLIENTS,
    useClass: QueryClients,
  },
  {
    provide: CLIENT_USECASE_PROVIDERS.DELETE_CLIENT,
    useClass: DeleteClient,
  },
];

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [
    ...validators,

    {
      provide: CLIENT_REPOSITORY_PROVIDER,
      useClass: ClientFirestoreRepository,
    },
    {
      provide: CLIENT_SERVICE_PROVIDER,
      useClass: ClientService,
    },

    ...clientUsecases,
  ],
  exports: [
    {
      provide: CLIENT_SERVICE_PROVIDER,
      useClass: ClientService,
    },
  ],
})
export class ClientModule {}
