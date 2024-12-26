import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { CLIENT_PREFERENCES_SERVICE_PROVIDER, ClientPreferences, IClientPreferencesService } from '../../../domain';

@Injectable()
export class GetClientPreferences implements Usecase<ClientPreferences> {
  constructor(
    @Inject(CLIENT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IClientPreferencesService,
  ) {}

  async execute(id: string): Promise<ClientPreferences> {
    return this.preferencesService.getPreferences(id);
  }
}
