import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../core/common';
import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IInvoiceSubmissionRepository, Invoice, Submission } from '../../domain';

@Injectable()
export class InvoiceSubmissionFirestoreRepository implements IInvoiceSubmissionRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.INVOICES)
    private readonly db: FirestoreService<Invoice>,
  ) {}

  private submissionFirestore(invoiceId: string): FirestoreService<Submission> {
    return this.db.nestedCollection<Submission>(invoiceId, 'submissions');
  }

  async get(id: string, invoiceId: string): Promise<Submission> {
    return this.submissionFirestore(invoiceId).getDoc(id);
  }

  async getMany(invoiceId: string, filters?: QueryFilter[]): Promise<Submission[]> {
    return this.submissionFirestore(invoiceId).getDocs(filters);
  }

  async add(submission: Partial<Submission> & { authority: Authority; submissionId: string; status: string }, invoiceId: string): Promise<Submission> {
    // Initiate some fields
    submission.createdBy = this.locker.user.uid;
    submission.createdAt = Date.now();
    submission.updatedBy = this.locker.user.uid;
    submission.updatedAt = Date.now();

    return this.submissionFirestore(invoiceId).addDoc(submission);
  }

  async addMany(submissions: Partial<Submission>[], invoiceId: string): Promise<Submission[]> {
    submissions.forEach(submission => {
      // Initiate some fields
      submission.createdBy = this.locker.user.uid;
      submission.createdAt = Date.now();
      submission.updatedBy = this.locker.user.uid;
      submission.updatedAt = Date.now();
    });

    return this.submissionFirestore(invoiceId).addDocs(submissions);
  }

  async update(submission: Partial<Submission> & { id: string }, invoiceId: string): Promise<Submission> {
    // Update some fields
    submission.updatedBy = this.locker.user.uid;
    submission.updatedAt = Date.now();

    return this.submissionFirestore(invoiceId).updateDoc(submission);
  }

  async updateMany(submissions: (Partial<Submission> & { id: string })[], invoiceId: string): Promise<Submission[]> {
    submissions.forEach(submission => {
      // Initiate some fields
      submission.updatedBy = this.locker.user.uid;
      submission.updatedAt = Date.now();
    });

    return this.submissionFirestore(invoiceId).updateDocs(submissions);
  }

  async delete(id: string, invoiceId: string): Promise<Submission> {
    return this.submissionFirestore(invoiceId).deleteDoc(id);
  }
}
