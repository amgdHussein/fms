import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IUserPreferencesService, USER_PREFERENCES_SERVICE_PROVIDER, UserPreferences } from '../../../domain';

@Injectable()
export class GetUserPreferences implements Usecase<UserPreferences> {
  constructor(
    @Inject(USER_PREFERENCES_SERVICE_PROVIDER)
    private readonly userPreferencesService: IUserPreferencesService,
  ) {}

  async execute(id: string): Promise<UserPreferences> {
    return this.userPreferencesService.getPreferences(id);
  }
}
