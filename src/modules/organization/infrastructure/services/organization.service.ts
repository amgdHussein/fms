import { Inject, Injectable } from '@nestjs/common';

import { CLOUD_TASKS_PROVIDER } from '../../../../core/constants';
import { NotFoundException } from '../../../../core/exceptions';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { CloudTasksService } from '../../../../core/providers';
import { Utils } from '../../../../core/utils';

import { IOrganizationRepository, IOrganizationService, Organization, ORGANIZATION_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
export class OrganizationService implements IOrganizationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationRepository,

    @Inject(CLOUD_TASKS_PROVIDER)
    private readonly cloudTasksService: CloudTasksService,
  ) {}

  // ? CRUD methods

  async getOrganization(id: string): Promise<Organization> {
    return this.repo.get(id);
  }

  async getOrganizations(filters?: QueryFilter[]): Promise<Organization[]> {
    return this.repo.getAll(filters);
  }

  async queryOrganizations(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Organization>> {
    return this.repo.query(page, limit, filters, order);
  }

  async addOrganization(organization: Partial<Organization> & { userId: string }): Promise<Organization> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    organization.systemId = Utils.Encrypt.generateId(characters, 16);

    return this.repo.add(organization).then(async newOrganization => {
      await this.cloudTasksService.createQueue(newOrganization.id);
      return newOrganization;
    });
  }

  async updateOrganization(organization: Partial<Organization> & { id: string }): Promise<Organization> {
    return this.repo.update(organization);
  }

  async deleteOrganization(id: string): Promise<Organization> {
    // TODO: DELETE ORGANIZATION QUEUE FROM CLOUD TASKS
    return this.repo.delete(id);
  }

  // ? Custom methods

  async getOrganizationBySystemId(sysId: string): Promise<Organization> {
    return this.repo.getAll([{ key: 'systemId', op: 'eq', value: sysId }]).then(res => {
      const org = res[0];

      if (org) return org;
      throw new NotFoundException(`No organization with systemId (${sysId})!`);
    });
  }
}
