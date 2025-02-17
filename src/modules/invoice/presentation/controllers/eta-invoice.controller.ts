import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from '../../../../core/guards';
import { AcceptEtaInvoice, CancelEtaInvoice, ProcessEtaInvoices, SubmitEtaInvoices } from '../../application';
import { ETA_INVOICE_USECASE_PROVIDERS } from '../../domain';
import { CancelEtaInvoiceDto, InvoiceDto, ProcessEtaInvoicesDto, SubmitEtaInvoicesDto } from '../dtos';

@ApiTags('ETA Invoices')
@Controller()
export class EtaInvoiceController {
  constructor(
    @Inject(ETA_INVOICE_USECASE_PROVIDERS.SUBMIT_INVOICES)
    private readonly submitInvoicesUsecase: SubmitEtaInvoices,

    @Inject(ETA_INVOICE_USECASE_PROVIDERS.CANCEL_INVOICE)
    private readonly cancelInvoiceUsecase: CancelEtaInvoice,

    @Inject(ETA_INVOICE_USECASE_PROVIDERS.PROCESS_INVOICE)
    private readonly processInvoicesUsecase: ProcessEtaInvoices,

    @Inject(ETA_INVOICE_USECASE_PROVIDERS.ACCEPT_INVOICE)
    private readonly acceptInvoiceUsecase: AcceptEtaInvoice,
  ) {}

  @Get('invoices/eta/sync')
  // TODO: ADD AUTHORIZATION GUARD TO VERIFY THE TOKEN TO EMIT THE HANDLER
  async syncInvoices(): Promise<void> {
    // TODO: ADD ENDPOINT TO SYNC ETA INVOICE DATA
  }

  @Post('invoices/eta/submit')
  // TODO: ADD AUTHORIZATION GUARD TO VERIFY THE TOKEN TO EMIT THE HANDLER
  async submitInvoices(@Body() dto: SubmitEtaInvoicesDto): Promise<void> {
    const { invoices, organizationId } = dto;
    return this.submitInvoicesUsecase.execute(invoices, organizationId);
  }

  @Post('invoices/eta/process')
  @UseGuards(AuthenticationGuard)
  // @MemberRoles(...Object.values(MemberRole))
  // @UseGuards(AuthorizeMemberRoleGuard)
  async processInvoices(@Body() dto: ProcessEtaInvoicesDto): Promise<boolean> {
    const { ids } = dto;
    return this.processInvoicesUsecase.execute(ids);
  }

  @Patch('invoices/:id/eta/accept')
  @UseGuards(AuthenticationGuard)
  async acceptInvoice(@Param('id') id: string): Promise<InvoiceDto> {
    return this.acceptInvoiceUsecase.execute(id);
  }

  @Patch('invoices/:id/eta/cancel')
  @UseGuards(AuthenticationGuard)
  // @MemberRoles(...Object.values(MemberRole))
  // @UseGuards(AuthorizeMemberRoleGuard)
  async cancelInvoice(@Param('id') id: string, @Body() dto: CancelEtaInvoiceDto): Promise<InvoiceDto> {
    const { uuid, status, reason } = dto;
    return this.cancelInvoiceUsecase.execute(id, uuid, status, reason);
  }
}
