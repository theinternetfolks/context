import { AsyncLocalStorage } from "async_hooks";

/**
 * the container payload interface that keeps the data stored in the Map
 * @interface IContextPayload
 * @property {string} id - the user-provided id of the context
 * @property {T} data - the data shared in the context
 */
type IContextPayload = Record<string, any>;

/**
 * the container interface that keeps the data stored in the Map
 * to be used by the async hooks
 */
/* c8 ignore start */
class Context {
  static store: AsyncLocalStorage<IContextPayload>;
  /* c8 ignore end */

  static Loader() {
    /**
     * The storage that stores all the data of the context.
     */
    this.store = new AsyncLocalStorage<IContextPayload>();
  }

  /**
   * Method used to store data in the context.
   * @param {object} data - the data to be stored.
   * @param {object} [options] - options for data to be stored.
   * @param {boolean} [options.overwrite] - if false, does not overwrite the data if key already exists.
   * @returns {boolean} - true if the data was set succesfully, false otherwise.
   */
  static set = (data: Record<string, any>): boolean => {
    const payload = this.store.getStore();

    if (!payload) {
      this.store.enterWith(data);
      return true;
    }

    const keys = Object.keys(data);

    if (keys.length) {
      for (const key of keys) {
        if (typeof payload[key] !== "undefined") {
          payload[key] = data[key];
        }
      }
      this.store.enterWith(payload);
      return true;
    }

    return false;
  };

  /**
   * Method used to retrieve the data shared in the context.
   * @param {string} key - the key of the data to be retrieved.
   * @returns {T | undefined} the data stored in the context.
   */
  static get = <T>(key: string | null = null): T | undefined => {
    const payload = this.store.getStore();
    if (!payload) {
      return;
    } else {
      if (key) {
        return payload[key];
      } else {
        return payload as T;
      }
    }
  };

  /**
   * Method used to delete the data stored in the context.
   * @param {string} [key] - the key of the data to be removed.
   */
  static remove = (key?: string): void => {
    const payload = this.store.getStore();
    if (payload) {
      if (key) {
        delete payload[key];
      } else {
        const keys = Object.keys(payload);
        for (const key of keys) {
          delete payload[key];
        }
      }

      this.store.enterWith(payload);
    }
  };
}

export default Context;
