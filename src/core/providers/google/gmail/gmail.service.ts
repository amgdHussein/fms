import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

import * as nodemailer from 'nodemailer';

import { GMAIL_QUEUE_PROVIDER, GMAIL_TRANSPORTER_PROVIDER } from '../../../constants';
import { InternalServerErrorException } from '../../../exceptions';
import { Mail } from './mail.entity';

@Injectable()
export class GmailService {
  private readonly logger = new Logger(GmailService.name);

  constructor(
    @Inject(GMAIL_TRANSPORTER_PROVIDER)
    private readonly transporter: nodemailer.Transporter,

    @InjectQueue(GMAIL_QUEUE_PROVIDER)
    private readonly queue: Queue<Mail>,
  ) {}

  async sendEMail(data: Mail): Promise<boolean> {
    const transporter: nodemailer.Transporter = this.transporter;

    // Verify the transporter before sending the email.
    await transporter.verify();

    try {
      // Send the email using the selected transporter.
      const mailOptions: nodemailer.SendMailOptions = {
        from: `${data.senderName} <${data.senderType}@mofawtar.com>`,
        to: data.recipient,
        subject: data.subject,
        html: data.body,
        headers: { 'Reply-To': data.replyTo },
        cc: data.cc,
        bcc: data.bcc,
        attachments: data.attachments?.map(attachment => ({
          filename: attachment.filename,
          content: Buffer.from(attachment.content, 'base64'),
        })),
      };

      // Send the email
      return transporter.sendMail(mailOptions);
    } catch (error) {
      // Log and throw an error if the email sending fails.
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to send email!');
    }
  }

  /**
   * Adds a job to the queue for sending an email.
   *
   * @param {Mail} mail - The email data to be sent.
   * @return {Promise<boolean>} A promise that resolves to true if the job is added successfully.
   */
  async addJob(mail: Mail): Promise<boolean> {
    return this.queue
      .add('send-mail', mail, {
        attempts: 7,
        removeOnComplete: true,
        removeOnFail: true,
        backoff: 1200000,
        // delay: 3000,
      })
      .then(() => true)
      .catch(error => {
        this.logger.error(error);
        return false;
      });
  }
}
