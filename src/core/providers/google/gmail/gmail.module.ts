import { BullModule } from '@nestjs/bull';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { GMAIL_CONFIGS_PROVIDER, GMAIL_PROVIDER, GMAIL_QUEUE_PROVIDER, GMAIL_TRANSPORTER_PROVIDER } from '../../../constants';

import { GmailConfigs } from './gmail.config';
import { GmailProcessor } from './gmail.processor';
import { GmailScripts } from './gmail.script';
import { GmailService } from './gmail.service';
import { MailSentListener } from './mail-sent.listener';

@Module({})
export class GmailModule {
  /**
   * Create a dynamic module for the Gmail service with the provided configurations.
   *
   * @param {GmailConfigs} configs - the configurations for the Gmail service
   * @return {DynamicModule} the dynamic module for the Gmail service
   */
  static forRoot(configs: GmailConfigs): DynamicModule {
    const configsProvider: Provider = {
      provide: GMAIL_CONFIGS_PROVIDER,
      useFactory: () => configs,
    };

    const gmailSupportProvider: Provider = {
      provide: GMAIL_TRANSPORTER_PROVIDER,
      useFactory: (configs: GmailConfigs): nodemailer.Transporter => {
        return this.createTransporter(configs);
      },
      inject: [GMAIL_CONFIGS_PROVIDER],
    };

    const gmailProvider: Provider = {
      provide: GMAIL_PROVIDER,
      useClass: GmailService,
    };

    const targetModule: DynamicModule = {
      global: true,
      imports: [BullModule.registerQueue({ name: GMAIL_QUEUE_PROVIDER })],
      providers: [configsProvider, gmailSupportProvider, gmailProvider, GmailProcessor, GmailScripts, MailSentListener],
      exports: [gmailProvider],
      module: GmailModule,
    };

    return targetModule;
  }

  /**
   * Creates a nodemailer transporter with the given configurations.
   *
   * @param {GmailConfigs} configs - Object containing user, client ID, and private key for authentication
   * @return {nodemailer.Transporter} The created nodemailer transporter
   */
  private static createTransporter(configs: GmailConfigs): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: configs.hostEmail,
      secure: true,
      secureConnection: false, // TLS requires secureConnection to be false
      tls: {
        ciphers: 'SSLv3',
      },
      requireTLS: true,
      port: 465,
      debug: true,
      auth: {
        user: configs.user,
        pass: configs.password,
      },
    } as SMTPTransport.Options);
  }
}
