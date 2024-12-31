export enum SenderType {
  SUPPORT = 'support',
}

export class Mail {
  recipient: string;
  replyTo: string;
  senderName: string;
  subject: string;
  body: string;
  senderType: SenderType;
  cc?: string;
  bcc?: string;
  attachments?: { filename: string; content: string }[];
}
