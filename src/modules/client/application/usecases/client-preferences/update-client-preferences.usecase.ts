import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { CLIENT_PREFERENCES_SERVICE_PROVIDER, ClientPreferences, IClientPreferencesService } from '../../../domain';

@Injectable()
export class UpdateClientPreferences implements Usecase<ClientPreferences> {
  constructor(
    @Inject(CLIENT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IClientPreferencesService,
  ) {}

  async execute(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    return this.preferencesService.updatePreferences(preferences);
  }
}
