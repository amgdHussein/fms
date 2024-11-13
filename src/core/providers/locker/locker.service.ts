import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { Environment } from '../../constants';

@Injectable()
export class LockerService {
  constructor(private readonly clsService: ClsService) {}

  public get user(): FirebaseUser {
    return this.clsService.get('user');
  }

  public get environment(): Environment {
    return this.clsService.get('environment');
  }
}

export interface FirebaseUser {
  uid: string;
  name: string;
  email: string;
}
