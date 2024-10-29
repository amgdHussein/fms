import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/common';
import { BadRequestException } from '../../../../../core/exceptions';
import { Usecase } from '../../../../../core/interfaces';

import { Code, CODE_SERVICE_PROVIDER, ICodeService } from '../../../domain';

@Injectable()
export class ImportCodes implements Usecase<Code> {
  constructor(
    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: ICodeService,
  ) {}

  async execute(authority: Authority, organizationId: string): Promise<Code[]> {
    if (Object.values(Authority).includes(authority)) {
      return this.codeService.importCodes(authority, organizationId);
    }

    throw new BadRequestException('Invalid authority');
  }
}
