import { Inject, Injectable } from '@nestjs/common';

import { CLOUD_TASKS_PROVIDER } from '../../../../core/constants';
import { QueryFilter, QueryOrder } from '../../../../core/models';
import { CloudTasksService } from '../../../../core/providers';

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

  async getOrganizations(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Organization[]> {
    return this.repo.getMany(filters, page, limit, order);
  }

  async addOrganization(organization: Partial<Organization> & { userId: string }): Promise<Organization> {
    return this.repo.add(organization).then(newOrganization => {
      // await this.cloudTasksService.createQueue(newOrganization.id); // TODO: UNCOMMENT IN PRODUCTION
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
}
