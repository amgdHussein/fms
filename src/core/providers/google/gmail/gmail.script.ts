import { Inject, Injectable, Logger } from '@nestjs/common';

import { DateTime } from 'luxon';

import { GMAIL_PROVIDER, REDIS_PROVIDER, SUPPORT_EMAIL } from '../../../constants';
import { RedisService } from '../../redis';

import { GmailService } from './gmail.service';
import { Mail, SenderType } from './mail.entity';

@Injectable()
export class GmailScripts {
  private readonly logger = new Logger(GmailScripts.name);

  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redis: RedisService,

    @Inject(GMAIL_PROVIDER)
    private readonly gmail: GmailService,
  ) {}

  async sendDailyReport(): Promise<void> {
    this.logger.debug('Gmail Daily Report');

    const mailsCount = (await this.redis.get<number>('mail-sent-count')) || 0;
    const succeededMailsCount = (await this.redis.get<number>('mail-success-count')) || 0;
    const failedMailsCount = (await this.redis.get<number>('mail-fails-count')) || 0;

    // Get the current date
    const now = DateTime.now().toFormat('dd MMMM yyyy');

    const data: Mail = {
      recipient: SUPPORT_EMAIL,
      replyTo: SUPPORT_EMAIL,
      senderName: 'Gmail Script',
      subject: `Gmail ${now} Report`,
      body: `<h2>Daily Mail Report</h2><br><h3>Total Mails Sent: ${mailsCount}</h3><br><h3>No. Of Successful Mails: ${succeededMailsCount} With ${
        (succeededMailsCount / mailsCount) * 100
      }% Rate</h3><br><h3>No. Of Failed Mails: ${failedMailsCount} With ${(failedMailsCount / mailsCount) * 100}% Rate</h3><br>`,
      senderType: SenderType.SUPPORT,
    };

    await this.gmail.sendEMail(data);

    await this.redis.set<number>('mail-sent-count', 0, 86400);
    await this.redis.set<number>('mail-success-count', 0, 86400);
    await this.redis.set<number>('mail-fails-count', 0, 86400);
  }
}
