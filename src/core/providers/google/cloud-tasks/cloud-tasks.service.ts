import { Injectable, Logger } from '@nestjs/common';

import { CloudTasksClient } from '@google-cloud/tasks';
import { google as GoogleProtos } from '@google-cloud/tasks/build/protos/protos';

import { CloudTasksConfigs } from './cloud-tasks.config';

@Injectable()
export class CloudTasksService {
  logger: Logger = new Logger(CloudTasksService.name);

  constructor(
    private readonly configs: CloudTasksConfigs,
    private readonly client: CloudTasksClient,
  ) {}

  /**
   * An asynchronous function that adds a task to a cloud queue.
   *
   * @param {string} queueName - the cloud queue name
   * @param {Task} task - the cloud task data
   * @return {Promise<Boolean>} a promise that resolves to true if the task is successfully added
   */
  async addTask(queueName: string, task: GoogleProtos.cloud.tasks.v2.ITask): Promise<boolean> {
    const queuePath = this.client.queuePath(this.configs.projectId, this.configs.projectRegion, queueName);
    return this.client
      .createTask({ parent: queuePath, task: task })
      .then(() => true)
      .catch(() => false);
  }

  async createQueue(queueName: string): Promise<void> {
    const { projectId, projectRegion } = this.configs;
    const parent = this.client.locationPath(projectId, projectRegion);
    const queue = {
      name: this.client.queuePath(projectId, projectRegion, queueName),
      // retryConfig: {
      //   maxAttempts: 1,
      //   maxBackoff: '10s',
      //   minBackoff: '1s',
      // },
      rateLimits: {
        maxDispatchesPerSecond: 500,
        maxBurstSize: 100,
      },
    };

    try {
      const [response] = await this.client.createQueue({ parent, queue });
      this.logger.debug(`Queue created: ${response.name}`);
    } catch (err) {
      if (err.code === 6) {
        // Already exists error code
        this.logger.error(`Queue already exists: ${queue.name}`);
      } else {
        this.logger.error('Error creating queue:', err);
      }
    }
  }

  getTaskName(queueName: string, taskName: string): string {
    return `projects/${this.configs.projectId}/locations/${this.configs.projectRegion}/queues/${queueName}/tasks/${taskName}`;
  }
}
