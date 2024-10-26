import { CollectionReference, Firestore, Settings } from '@google-cloud/firestore';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, FIRESTORE_OPTIONS_PROVIDER, FIRESTORE_PROVIDER } from '../../../constants';
import { FirestoreModuleOptions } from './firestore.config';
import { FirestoreService } from './firestore.service';

@Module({})
export class FirestoreModule {
  static forRoot(options: FirestoreModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: FIRESTORE_OPTIONS_PROVIDER,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const databaseProvider: Provider = {
      provide: FIRESTORE_PROVIDER,
      useFactory: (config: Settings): Firestore => new Firestore(config),
      inject: [FIRESTORE_OPTIONS_PROVIDER],
    };

    // Create provider for each collection, and inject them into any server by their names
    const collectionProviders: Provider[] = Object.values(FIRESTORE_COLLECTION_PROVIDERS).map((collectionProvider: string): Provider => {
      return {
        provide: collectionProvider,
        useFactory: <T>(database: Firestore): FirestoreService<T & { id: string }> => {
          const collection = database.collection(collectionProvider) as CollectionReference<T & { id: string }>;
          return new FirestoreService(collection);
        },
        inject: [FIRESTORE_PROVIDER],
      };
    });

    const targetModule: DynamicModule = {
      global: true,
      imports: options.imports,
      module: FirestoreModule,
      providers: [optionsProvider, databaseProvider, ...collectionProviders],
      exports: [databaseProvider, ...collectionProviders],
    };

    return targetModule;
  }
}
