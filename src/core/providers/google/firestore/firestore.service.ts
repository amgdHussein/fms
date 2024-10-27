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
   * Retrieves all documents from the collection that match the specified filters.
   * @param {QueryFilter[]} [filters] - An array of filters to apply to the query
   * @return {Promise<T[]>} A promise that resolves with an array of documents that match the filter(s)
   */
  async getDocs(filters?: QueryFilter[]): Promise<T[]> {
    const query: Query<T> = this.buildQuery(filters).withConverter<T>(this.firestoreConverter);

    return query
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()))
      .catch(error => {
        Logger.error(error);
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
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while adding new ${this.collectionName} document!`);
      });
  }

  async addDocs(entities: Partial<T>[]): Promise<Array<T>> {
    const batch = this.collection.firestore.batch();

    const output = [];

    entities.forEach(entity => {
      const docRef = this.collection.doc().withConverter<T>(this.firestoreConverter);
      const input = { ...entity, id: docRef.id } as T;

      output.push(input);
      batch.set(docRef, input);
    });

    return batch
      .commit()
      .then(() => output)
      .catch(error => {
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while adding multiple ${this.collectionName}.`);
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
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while replacing ${this.collectionName} document!`);
      });
  }

  /**
   * Add multiple documents to the specified CollectionReference with the given data array.
   * @param {Array<object>} entities Array of document data to be added (Ids not required)
   * @return {Promise<Array<object>>} Array of new document data
   * @example await setDocs([
   *   {'username':'Ahmed', 'age': 23},
   *   {'username':'Ali', 'age': 30},
   * ])
   */
  async setDocs(entities: Array<T>): Promise<Array<T>> {
    // const docRef = this.collection.doc();
    const docRef = this.collection.doc().withConverter<T>(this.firestoreConverter);
    const batch = docRef.firestore.batch();

    const addedDocs = entities.map(entity => {
      batch.set(docRef, entity);
      return { id: docRef.id, ...entity };
    });

    return batch
      .commit()
      .then(() => addedDocs)
      .catch(error => {
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while adding multiple ${this.collectionName}.`);
      });
  }

  async updateDocs(entities: Array<T>): Promise<boolean> {
    const batch = this.collection.firestore.batch();

    entities.map(entity => {
      const docRef = this.collection.doc(entity.id).withConverter<T>(this.firestoreConverter);
      const flatEntity = Utils.Object.flatten(entity);
      batch.update(docRef, flatEntity);
    });

    return batch
      .commit()
      .then(() => true)
      .catch(error => {
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while adding multiple ${this.collectionName}.`);
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
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while updating ${this.collectionName} document!`);
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
        Logger.error(error);
        throw new InternalServerErrorException(`An error occurred while deleting ${this.collectionName} document!`);
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
  async query(page = 1, limit = 30, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<T>> {
    let queries: Query<T> = this.buildQuery(filters).withConverter<T>(this.firestoreConverter);
    const entities: number = (await queries.count().get()).data().count;

    if (order) queries = queries.orderBy(order.key, order.dir);
    if (page > 0 && limit > 0) queries = queries.offset(limit * (page - 1));
    if (limit > 0) queries = queries.limit(limit);

    const data: T[] = await queries
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()))
      .catch(error => {
        Logger.error(error);
        throw new InternalServerErrorException('An error occurred while querying data!');
      });

    return {
      data: data, // items
      page: page, // current page
      pages: Math.ceil(entities / limit), // number of pages
      perPage: limit, // number of items per page
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
        query = query.where(param.key, this.filterOpToFirestoreOp[param.op], param.value);
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
        Logger.error(error);
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
