import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GMAIL_PROVIDER, REDIS_PROVIDER, SUPPORT_EMAIL } from '../../../constants';
import { RedisService } from '../../redis';

import { GmailService } from './gmail.service';
import { Mail, SenderType } from './mail.entity';

@Injectable()
export class MailSentListener {
  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redis: RedisService,

    @Inject(GMAIL_PROVIDER)
    private readonly gmail: GmailService,
  ) {}

  @OnEvent('gmail.mail.sent')
  async handleMailSent(): Promise<void> {
    const currentCount = (await this.redis.get<number>('mail-sent-count')) || 0;
    await this.redis.set<number>('mail-sent-count', +currentCount + 1, 86400);
  }

  @OnEvent('gmail.mail.sent.success')
  async handleMailSentSuccessful(): Promise<void> {
    const currentCount = (await this.redis.get<number>('mail-success-count')) || 0;
    await this.redis.set<number>('mail-success-count', +currentCount + 1, 86400);
  }

  @OnEvent('gmail.mail.sent.fails')
  async handleMailSentFailed(payload: { reason: string; attempts: number; data: Mail }): Promise<void> {
    if (payload.attempts == 3) {
      const currentCount = (await this.redis.get<number>('mail-fails-count')) || 0;
      await this.redis.set<number>('mail-fails-count', +currentCount + 1, 86400);

      const data: Mail = {
        recipient: SUPPORT_EMAIL,
        replyTo: SUPPORT_EMAIL,
        senderName: 'Backend Gmail',
        subject: `Gmail Mail Fails`,
        body: `An E-mail Fails Because ${payload.reason} the data of the email was ${JSON.stringify(payload.data)}`,
        senderType: SenderType.SUPPORT,
      };

      await this.gmail.sendEMail(data);
    }
  }
}
