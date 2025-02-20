import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/enums';
import { Usecase } from '../../../../../core/interfaces';

import { Code, CODE_SERVICE_PROVIDER, ICodeService } from '../../../domain';

@Injectable()
export class UpdateRequestedCode implements Usecase<Code> {
  constructor(
    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: ICodeService,
  ) {}

  async execute(code: Partial<Code> & { id: string; authority: Authority; organizationId: string; requestId: number }): Promise<Code> {
    return this.codeService.updateRequestedCode(code);
  }
}
