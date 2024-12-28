import { Global, Module } from '@nestjs/common';

import {
  AddClient,
  AddClients,
  DeleteClient,
  GetClient,
  GetClientPreferences,
  IsClientExistConstraint,
  QueryClients,
  UpdateClient,
  UpdateClientPreferences,
} from './application';
import {
  CLIENT_PREFERENCES_REPOSITORY_PROVIDER,
  CLIENT_PREFERENCES_SERVICE_PROVIDER,
  CLIENT_PREFERENCES_USECASE_PROVIDERS,
  CLIENT_REPOSITORY_PROVIDER,
  CLIENT_SERVICE_PROVIDER,
  CLIENT_TAX_REPOSITORY_PROVIDER,
  CLIENT_TAX_SERVICE_PROVIDER,
  CLIENT_USECASE_PROVIDERS,
} from './domain';
import {
  ClientFirestoreRepository,
  ClientPreferencesFirestoreRepository,
  ClientPreferencesService,
  ClientService,
  ClientTaxFirestoreRepository,
  ClientTaxService,
} from './infrastructure';
import { ClientController, ClientPreferencesController } from './presentation';

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
const preferencesUsecases = [
  {
    provide: CLIENT_PREFERENCES_USECASE_PROVIDERS.GET_CLIENT_PREFERENCES,
    useClass: GetClientPreferences,
  },
  {
    provide: CLIENT_PREFERENCES_USECASE_PROVIDERS.UPDATE_CLIENT_PREFERENCES,
    useClass: UpdateClientPreferences,
  },
];

@Global()
@Module({
  controllers: [ClientController, ClientPreferencesController],
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
    {
      provide: CLIENT_TAX_REPOSITORY_PROVIDER,
      useClass: ClientTaxFirestoreRepository,
    },
    {
      provide: CLIENT_TAX_SERVICE_PROVIDER,
      useClass: ClientTaxService,
    },
    {
      provide: CLIENT_PREFERENCES_REPOSITORY_PROVIDER,
      useClass: ClientPreferencesFirestoreRepository,
    },
    {
      provide: CLIENT_PREFERENCES_SERVICE_PROVIDER,
      useClass: ClientPreferencesService,
    },

    ...clientUsecases,
    ...preferencesUsecases,
  ],
  exports: [
    {
      provide: CLIENT_SERVICE_PROVIDER,
      useClass: ClientService,
    },
    {
      provide: CLIENT_TAX_SERVICE_PROVIDER,
      useClass: ClientTaxService,
    },
  ],
})
export class ClientModule {}
