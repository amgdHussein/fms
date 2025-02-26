import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/enums';
import { Usecase } from '../../../../../core/interfaces';

import { Code, CODE_SERVICE_PROVIDER, ICodeService } from '../../../domain';

@Injectable()
export class AddCodes implements Usecase<Code> {
  constructor(
    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: ICodeService,
  ) {}

  async execute(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]> {
    return this.codeService.addCodes(codes, authority, organizationId);
  }
}
