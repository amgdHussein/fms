import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  /**
   * Asynchronously gets the value associated with the specified key from the Redis database.
   * @param {string} key - the key to look up in the Redis database
   * @return {Promise<T>} the value associated with the specified key
   */
  async get<T>(key: string): Promise<T> {
    return await this.cache.get(key);
  }

  /**
   * Set a key-value pair in the cache with a specified time-to-live.
   *
   * @param {string} key - the key to set in the cache
   * @param {unknown} value - the value to associate with the key
   * @param {number} ttl - the time-to-live for the key-value pair in seconds
   * @return {Promise<unknown>} a Promise that resolves when the key-value pair is successfully set in the cache
   */
  async set<T>(key: string, value: unknown, ttl: number): Promise<T> {
    return await this.cache.set<T>(key, value, ttl);
  }

  /**
   * Deletes a cache entry by key.
   *
   * @param {string} key - The key of the cache entry to delete
   * @return {Promise<void>} A promise that resolves when the cache entry is deleted
   */
  async delete(key: string): Promise<void> {
    return await this.cache.del(key);
  }

  /**
   * Reset the function to its initial state.
   *
   * @return {Promise<void>} The result of the reset operation as a Promise
   */
  async reset(): Promise<void> {
    return await this.cache.reset();
  }
}
