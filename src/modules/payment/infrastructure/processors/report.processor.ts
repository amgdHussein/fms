import { Processor } from '@nestjs/bull';

@Processor('reports-queue')
export class ReportProcessor {
  // private readonly logger = new Logger(ReportsProcessor.name);
  // constructor(
  //   @Inject(ReportService)
  //   private readonly reportService: ReportService,
  // ) {}
  // @OnQueueActive()
  // onActive(job: Job) {
  //   this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  // }
  // @OnQueueCompleted()
  // onComplete(job: Job, result: any) {
  //   this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  // }
  // @OnQueueFailed()
  // onError(job: Job<any>, error: any) {
  //   this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`);
  // }
  // @Process('cases-report')
  // async handleCasesReport(job: Job) {
  //   this.logger.debug(`Handling cases report for job ${job.id}`);
  //   const startDate = moment().add(1, 'day').format('YYYY-MM-DD');
  //   const endDate = moment().add(29, 'days').format('YYYY-MM-DD');
  //   await this.reportService.generateAccountingData(startDate, endDate, 'cases');
  //   return true;
  // }
}
