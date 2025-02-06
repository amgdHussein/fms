import { Injectable, Logger } from '@nestjs/common';

import {
  CollectionReference,
  FieldValue,
  FirestoreDataConverter,
  PartialWithFieldValue,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
  WithFieldValue,
} from '@google-cloud/firestore';

import { BadRequestException, InternalServerErrorException, NotFoundException } from '../../../exceptions';
import { QueryFilter, QueryOp, QueryOrder, QueryResult } from '../../../models';
import { Utils } from '../../../utils';

@Injectable()
export class FirestoreService<T extends { id: string }> {
  // Convert collection name into capitalized singular name (ex. users => user)
  private readonly collectionName: string = this.collection.id.slice(0, -1);
  private readonly logger: Logger = new Logger(`${FirestoreService.name}.${this.collectionName}`);

  private readonly firestoreConverter: FirestoreDataConverter<T> = {
    /**
     * Drop id and undefined fields if exists
     * @param {WithFieldValue<T>} entity Entity to set/ update
     * @return {T} The data provided to firestore
     */
    toFirestore(entity: WithFieldValue<T>): PartialWithFieldValue<T> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = entity;
      return Utils.Object.replaceUndefinedWithNull(data);
    },

    /**
     * Converts a Firestore document snapshot to a custom type.
     * @param {QueryDocumentSnapshot<T>} snapshot - The Firestore document snapshot to convert
     * @return {T & { id: string }} The converted custom type
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<T>): T & { id: string } {
      const data = snapshot.data();
      return { ...data, id: snapshot.id };
    },
  };

  private readonly filterOpToFirestoreOp: { [key in QueryOp]: WhereFilterOp } = {
    eq: '==',
    neq: '!=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    in: 'in',
    nin: 'not-in',
    arcoay: 'array-contains-any',
    arco: 'array-contains',
  };

  constructor(private readonly collection: CollectionReference<T>) {}

  /**
   * Retrieves a document with the specified id from the collection.
   * @param {string} id - The id of the document to retrieve
   * @return {Promise<T>} The retrieved document
   */
  async getDoc(id: string): Promise<T> {
    const docRef = this.collection.doc(id).withConverter<T>(this.firestoreConverter);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`The ${this.collectionName} with specified id(${id}) does not exist!`);
    }

    return doc.data();
  }

  /**
   * Retrieves documents from the collection based on the provided filters, pagination, and sorting options.
   *
   * @param {Array<QueryFilter>} [filters] - Optional filters to apply to the query.
   * @param {number} [page] - Optional page number for pagination.
   * @param {number} [limit] - Optional number of documents to retrieve per page.
   * @param {QueryOrder} [orderBy] - Optional sorting order for the query.
   * @return {Promise<T[]>} A promise that resolves with an array of the retrieved documents.
   * @throws {InternalServerErrorException} If an error occurs while fetching the documents.
   */
  async getDocs(filters?: QueryFilter[], page?: number, limit?: number, orderBy?: QueryOrder): Promise<T[]> {
    let queries: Query<T> = this.buildQuery(filters).withConverter<T>(this.firestoreConverter);
    if (orderBy) queries = queries.orderBy(orderBy.key, orderBy.dir);
    if (page && limit && page > 0 && limit > 0) queries = queries.offset(limit * (page - 1));
    if (limit && limit > 0) queries = queries.limit(limit);

    return queries
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()))
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException('Something went wrong while fetching the documents!');
      });
  }

  /**
   * Adds a new document to the collection.
   * @param {T} entity - the entity to be added
   * @return {Promise<T>} a promise that resolves with the added entity
   */
  async addDoc(entity: Partial<T>): Promise<T> {
    const docRef = this.collection.doc().withConverter<Partial<T>>(this.firestoreConverter);

    return docRef
      .set(entity)
      .then(() => ({ ...entity, id: docRef.id }) as T)
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException(`An error occurred while adding new ${this.collectionName} document!`);
      });
  }

  async addDocs(entities: Partial<T>[]): Promise<T[]> {
    const batch = this.collection.firestore.batch();
    const addedDocs: T[] = [];

    entities.forEach(entity => {
      const docRef = this.collection.doc().withConverter<T>(this.firestoreConverter);
      const entityWithId = { ...entity, id: docRef.id } as T;

      // Queue the set operation in the batch
      batch.set(docRef, entityWithId);
      addedDocs.push(entityWithId);
    });

    return batch
      .commit()
      .then(() => {
        this.logger.log(`Successfully added ${entities.length} documents to ${this.collectionName}.`);
        return addedDocs;
      })
      .catch(error => {
        this.logger.error(`An error occurred while adding multiple documents to ${this.collectionName}: ${error.message}`, error);
        throw new InternalServerErrorException(`An error occurred while adding multiple documents to ${this.collectionName}.`);
      });
  }

  /**
   * Add a new document to specified CollectionReference with the given data, assigning it a document ID automatically.
   * @param {T} entity Document data to be added (Id not required)
   * @return {Promise<T>} The new document data
   */
  async setDoc(entity: T & { id: string }): Promise<T> {
    const docRef = this.collection.doc(entity.id).withConverter<T>(this.firestoreConverter);

    return docRef
      .set(entity)
      .then(() => entity)
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException(`An error occurred while replacing ${this.collectionName} document!`);
      });
  }

  /**
   * Add multiple documents to the specified CollectionReference with the given data array.
   *
   * @param {Array<object>} entities Array of document data to be added (Ids not required)
   * @return {Promise<Array<object>>} Array of new document data
   * @example await setDocs([
   *   {'username':'Ahmed', 'age': 23},
   *   {'username':'Ali', 'age': 30},
   * ])
   */
  async setDocs(entities: Array<T>): Promise<Array<T>> {
    const batch = this.collection.firestore.batch();
    const addedDocs: T[] = [];

    entities.forEach(entity => {
      const docRef = this.collection.doc().withConverter<T>(this.firestoreConverter);
      const entityWithId = { ...entity, id: docRef.id } as T;
      batch.set(docRef, entity);
      addedDocs.push(entityWithId);
    });

    return batch
      .commit()
      .then(() => {
        this.logger.log(`Successfully added ${entities.length} documents to ${this.collectionName}.`);
        return addedDocs;
      })
      .catch(error => {
        this.logger.error(`An error occurred while adding multiple documents to ${this.collectionName}: ${error.message}`, error);
        throw new InternalServerErrorException(`An error occurred while adding multiple documents to ${this.collectionName}.`);
      });
  }

  /**
   * Updates fields in the document referred to by the specified DocumentReference.
   * The update will fail if applied to a document that does not exist.
   * @param {T} entity Document data to be updated (Id must be specified)
   * @return {Promise<T>} The updated document data
   */
  async updateDoc(entity: Partial<T> & { id: string }): Promise<T> {
    const docRef = this.collection.doc(entity.id).withConverter<T>(this.firestoreConverter);

    // Update document data
    const doc = await this.getDoc(docRef.id);
    const updatedDoc = Utils.Object.mergeObjects(doc, entity);

    return docRef
      .set(updatedDoc)
      .then(() => updatedDoc)
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException(`An error occurred while updating ${this.collectionName} document!`);
      });
  }

  /**
   * Updates multiple documents in the collection.
   * @param {Array<T>} entities - An array of document data to be updated (Id must be specified in each document)
   * @return {Promise<boolean>} A promise that resolves to true if the update is successful
   */
  async updateDocs(entities: Array<Partial<T> & { id: string }>): Promise<T[]> {
    const batch = this.collection.firestore.batch();

    // Iterate over each entity and prepare the batch update
    entities.forEach(entity => {
      if (!entity.id) {
        this.logger.error(`Document id is missing for one of the entities in the update request: ${JSON.stringify(entity)}`);
        throw new BadRequestException('Document id is required for updating.');
      }

      const docRef = this.collection.doc(entity.id).withConverter<T>(this.firestoreConverter);
      const flattenedEntity = Utils.Object.flatten(entity);

      // Add update operation to the batch
      batch.update(docRef, flattenedEntity);
    });

    // Commit the batch and handle potential errors
    return batch
      .commit()
      .then(() => entities as T[])
      .catch(error => {
        this.logger.error(`Error occurred while updating documents in ${this.collectionName}: ${error.message}`, error);
        throw new InternalServerErrorException(`An error occurred while updating multiple ${this.collectionName} documents.`);
      });
  }

  /**
   * Deletes the document referred to by the specified DocumentReference.
   * @param {string} id The ID of the document to be deleted
   * @return {Promise<T>} The deleted document data
   */
  async deleteDoc(id: string): Promise<T> {
    const entity = await this.getDoc(id); // Throw error if the id not exist

    const docRef = this.collection.doc(id);
    return docRef
      .delete()
      .then(() => entity)
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException(`An error occurred while deleting ${this.collectionName} document!`);
      });
  }

  /**
   * Deletes all documents in the collection.
   * @return {Promise<boolean>} A promise that resolves to true if all documents are successfully deleted.
   */
  /**
   * Deletes all documents in the collection and returns the deleted documents.
   * @return {Promise<T[]>} A promise that resolves to an array of the deleted documents.
   */
  async deleteDocs(): Promise<T[]> {
    const querySnapshot = await this.collection.get();

    if (querySnapshot.empty) {
      this.logger.warn(`No documents found in the ${this.collectionName} to delete.`);
      return []; // No documents to delete, return an empty array.
    }

    const batch = this.collection.firestore.batch();
    const deletedDocs: T[] = [];

    querySnapshot.docs.forEach(doc => {
      const docRef = this.collection.doc(doc.id);
      batch.delete(docRef);
      const docData = this.firestoreConverter.fromFirestore(doc);
      deletedDocs.push(docData);
    });

    return batch
      .commit()
      .then(() => {
        this.logger.log(`All documents in the ${this.collectionName} have been successfully deleted.`);
        return deletedDocs;
      })
      .catch(error => {
        this.logger.error(`An error occurred while deleting all documents in ${this.collectionName}: ${error.message}`, error);
        throw new InternalServerErrorException(`An error occurred while deleting all documents in ${this.collectionName}.`);
      });
  }

  /**
   * Executes the query and returns the results as a QuerySnapshot.
   * @param {number} page Pagination to prevent data overload
   * @param {number} limit Number of entities per page
   * @param {Array<QueryFilter>} filters - List of QueryFilter each filter has its own {field, operator, value}
   * @param {QueryOrder} order - Order object that contains {field, direction} to sort by field in specified direction
   * @return {Promise<QueryResult<T>>} The query documents data and meta data
   */
  async query(filters?: QueryFilter[], page = 1, limit = 30, order?: QueryOrder): Promise<QueryResult<T>> {
    let queries: Query<T> = this.buildQuery(filters).withConverter<T>(this.firestoreConverter);
    const entities: number = (await queries.count().get()).data().count;

    if (order) queries = queries.orderBy(order.key, order.dir);
    if (page > 0 && limit > 0) queries = queries.offset(limit * (page - 1));
    if (limit > 0) queries = queries.limit(limit);

    const data: T[] = await queries
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()))
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException('An error occurred while querying data!');
      });

    return {
      data: data, // items
      page: page, // current page
      pages: Math.ceil(entities / limit), // number of pages
      limit: limit, // number of items per page
      total: entities, // total number of items exists
    };
  }

  /**
   * Create queries by applying params
   * @param {Array<QueryFilter>} filters List of params to be applied
   * @return {Query<T>} Query object that meets params
   */
  private buildQuery(filters?: QueryFilter[]): Query<T> {
    let query: Query<T> = this.collection;

    if (filters && filters.length > 0) {
      for (const param of filters) {
        query = query.where(param.key, this.filterOpToFirestoreOp[param.operator], param.value);
      }
    }

    return query;
  }

  /**
   * Increment a specific field of a document by a certain value.
   * @param {string} id - The ID of the document to be updated
   * @param {string} field - The name of the field to be incremented
   * @param {number} incrementValue - The value by which the field should be incremented
   * @return {Promise<T>} A promise that resolves to the updated document
   */
  async incrementField(id: string, field: string, incrementValue: number): Promise<T> {
    const docRef = this.collection.doc(id);

    const entity: T = await this.getDoc(id); // Throw error if the id not exist

    if (!entity[field]) {
      throw new BadRequestException(`Field ${field} does not exist!`);
    }

    if (incrementValue <= 0) {
      throw new BadRequestException('Increment value must be greater than 0!');
    }

    return docRef
      .update(field, FieldValue.increment(incrementValue))
      .then(() => {
        return { ...entity, [field]: entity[field] + incrementValue };
      })
      .catch(error => {
        this.logger.error(error);
        throw new InternalServerErrorException(`An error occurred while incrementing ${field}!`);
      });
  }

  /**
   * A function that creates a nested Firestore collection service based on the document and nested collection names.
   * @param {string} documentPath - the name of the document
   * @param {string} collectionPath - the name of the nested collection inside the document
   * @return {FirestoreService<T & { id: string }>} a Firestore collection service for the nested collection
   */
  nestedCollection<T>(documentPath: string, collectionPath: string): FirestoreService<T & { id: string }> {
    if (!documentPath || !collectionPath) {
      throw new BadRequestException('Document name and nested collection name must be provided!');
    }

    const docRef = this.collection.doc(documentPath);
    const collection = docRef.collection(collectionPath) as CollectionReference<T & { id: string }>;

    return new FirestoreService<T & { id: string }>(collection);
  }

  /**
   * Retrieves a document from the collection by shaKey.
   *
   * @param {string} shaKey - The shaKey used to retrieve the document
   * @return {Promise<T | null>} The retrieved document or null if not found
   */
  async getByShaKey(shaKey: string): Promise<T | null> {
    const query = this.collection.withConverter<T>(this.firestoreConverter).where('shaKey', '==', shaKey).limit(1);
    const querySnapshot = await query.get();

    if (!querySnapshot.empty) {
      // Assuming you want to return the first matching document
      return querySnapshot.docs.shift().data();
    }

    return null;
  }
}
