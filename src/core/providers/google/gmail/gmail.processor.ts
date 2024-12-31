import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';

import { EVENT_EMITTER_PROVIDER, GMAIL_PROVIDER, GMAIL_QUEUE_PROVIDER } from '../../../constants';

import { GmailService } from './gmail.service';
import { Mail } from './mail.entity';

@Processor(GMAIL_QUEUE_PROVIDER)
export class GmailProcessor {
  private readonly logger = new Logger(GmailProcessor.name);

  constructor(
    @Inject(EVENT_EMITTER_PROVIDER)
    private readonly eventEmitter: EventEmitter2,

    @Inject(GMAIL_PROVIDER)
    private readonly gmailService: GmailService,
  ) {}

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: unknown): void {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
    this.eventEmitter.emit('gmail.mail.sent.success');
  }

  @OnQueueFailed()
  onError(job: Job<Mail>, error: Error): void {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`);

    this.eventEmitter.emit('gmail.mail.sent.fails', {
      reason: job.failedReason,
      attempts: job.attemptsMade,
      data: job.data,
    });
  }

  @Process('send-mail')
  async handleTranscode(job: Job): Promise<boolean> {
    this.eventEmitter.emit('gmail.mail.sent');

    return this.gmailService.sendEMail(job.data);
  }
}
