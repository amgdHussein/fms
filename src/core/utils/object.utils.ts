/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Flatten the object and convert the nested properties into dot notation keys.
 * @param { object } obj Object to convert it into dot notation keys
 * @return { object } The flatten object
 * @example
 *  const initialData = {
 *    name: 'Frank',
 *    age: 12,
 *    favorites: {
 *      food: 'Pizza',
 *      color: 'Blue',
 *      subject: 'recess'
 *    }
 *  };
 *
 *  const flattenedData = flattenObject(initialData);
 *    flattenedData => {
 *      name: 'Frank',
 *      age: 12,
 *      'favorites.food': 'Pizza',
 *      'favorites.color': 'Blue',
 *      'favorites.subject': 'recess'
 *    }
 */
export function flatten(obj: any, parentKey = ''): any {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, this.flatten(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Drop the undefined fields from an object.
 * @param { object } obj Object to drop undefined sub-fields
 * @return { object } The valid object
 * @example
 *  const obj = {
 *    name: 'Frank',
 *    age: 12,
 *    favorites: {
 *      food: 'Pizza',
 *      colors: [undefined, 'Blue'],
 *      subject: undefined
 *    }
 *  };
 *
 *  const validObj = dropUndefined(obj);
 *    validObj => {
 *      name: 'Frank',
 *      age: 12,
 *      favorites: { food: 'Pizza', colors: [ 'Blue' ] }
 *    }
 */
export function dropUndefined(obj: any): any {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const newArray = obj.map(item => this.dropUndefined(item)).filter(item => item !== undefined);
    return newArray;
  }

  if (typeof obj === 'object') {
    const targetObj: Record<string, any> = {};

    for (const key in obj) {
      const value = this.dropUndefined(obj[key]);
      if (value !== undefined) {
        targetObj[key] = value;
      }
    }

    return Object.keys(targetObj).length > 0 ? targetObj : undefined;
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return undefined;
  }

  return obj;
}

/**
 * Merges two objects recursively, with properties from the second object overwriting properties in the first object.
 *
 * @param {any} obj1 - The first object to merge.
 * @param {any} obj2 - The second object to merge.
 * @return {any} The merged object.
 */
export function mergeObjects(obj1: any, obj2: any): any {
  const mergedObject = { ...obj1 };

  for (const key in obj2) {
    const isValidObj = obj2[key] != null && typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && Object.keys(obj2[key]).length > 0;

    if (isValidObj) {
      mergedObject[key] = this.mergeObjects(mergedObject[key], obj2[key]);
    } else {
      mergedObject[key] = obj2[key];
    }
  }

  return mergedObject;
}

/**
 * Replaces undefined values with null recursively in the given object.
 *
 * @param {object} obj - The object in which to replace undefined values with null.
 * @return {object} The modified object with undefined values replaced by null.
 */
export function replaceUndefinedWithNull(obj: object): object {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      obj[key] = null;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceUndefinedWithNull(obj[key]);
    }
  });

  return obj;
}
