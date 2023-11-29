import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Key that is added before each key to prevent conflicked key with other applications.
   */
  readonly appKey: string = 'smartpos_emenu:'; // prevent conflicked key with other applications

  constructor(private storage: Storage) { }

  /**
   * Gets data from storage
   * @param key key to get the data
   * @returns  array of items
   */
  async get(key: string) {
    try {
      return await this.storage.get(this.appKey + key);
    } catch (e) {
      return null;
    }
  }

  /**
   * Saves data to local storage (cache). appKey will be added to the prefix of the key.
   * @param key key to set the data
   * @param data data that will be saved
   * @returns  promise resolved after save
   */
  async save(key: string, data: any) {
    return await this.storage.set(this.appKey + key, data);
  }

  /**
   * Removes data from storage
   * @param key key to search for
   * @returns  promise resolved after remove
   */
  async remove(key: string) {
    return await this.storage.remove(this.appKey + key);
  }
}
