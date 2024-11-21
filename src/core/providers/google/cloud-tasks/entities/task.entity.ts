export interface CloudTask {
  recipient: string;
  replyto: string;
  senderName: string;
  subject: string;
  body: string;
  senderType: string;
}

export interface CloudTasksQueue {
  project: string;
  location: string;
  queue: string;
}
