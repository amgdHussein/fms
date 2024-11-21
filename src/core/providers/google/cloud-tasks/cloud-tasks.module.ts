import { DynamicModule, Module, Provider } from '@nestjs/common';

import { CloudTasksClient } from '@google-cloud/tasks';

import { CLOUD_TASKS_PROVIDER } from '../../../constants';

import { CloudTasksConfigs } from './cloud-tasks.config';
import { CloudTasksService } from './cloud-tasks.service';

@Module({})
export class CloudTasksModule {
  /**
   * Create a dynamic module for CloudTasks using the provided configurations.
   *
   * @param {CloudTasksConfigs} configs - the configurations for CloudTasks
   * @return {DynamicModule} the created dynamic module for CloudTasks
   */
  static forRoot(configs: CloudTasksConfigs): DynamicModule {
    const taskClientProvider: Provider = {
      provide: CLOUD_TASKS_PROVIDER,
      useFactory: () => {
        const techClient = new CloudTasksClient(configs);
        return new CloudTasksService(configs, techClient);
      },
    };

    const targetModule: DynamicModule = {
      global: true,
      providers: [taskClientProvider],
      exports: [taskClientProvider],
      module: CloudTasksModule,
    };

    return targetModule;
  }
}
