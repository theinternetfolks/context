import * as asyncHooks from "async_hooks";

import * as crypto from "crypto";

/**
 * the container payload interface that keeps the data stored in the Map
 */
export interface ICoreContextPayload<T> {
  id: string;
  data: T;
}

/**
 * the container interface that keeps the data stored in the Map
 * to be used by the async hooks
 */
export class CoreContext {
  /**
   * The Map that stores all the data of the context.
   */
  static store = new Map();

  /**
   * Method that should be called the first thing, also only once,
   * to enable the library to work, by enabling async hooks.
   */
  static Loader() {
    const asyncHook = asyncHooks.createHook({
      /**
       * The init hook is called when a new async context is created.
       * In the implementation of our init() callback, we check if the triggerAsyncId is present in the store.
       * If it exists, we create a mapping of the asyncId to the request data stored under the triggerAsyncId.
       * This in effect ensures that we store the same request object for child asynchronous resources.
       *
       * @param asyncId - an identifier of the current execution context.
       * @param {string} _ - the kind of resource that is being used
       * @param {number} triggerAsyncId - the identifier of the parent resource that triggered the execution of the async resource.
       * @param {object} resource - the object of the resource that is being used.
       */
      init: (asyncId, _, triggerAsyncId, resource) => {
        if (CoreContext.store.has(triggerAsyncId)) {
          CoreContext.store.set(asyncId, CoreContext.store.get(triggerAsyncId));
        }
      },
      /**
       * The destroy hook is called when an async context is destroyed.
       * The destroy() callback checks if the store has the asyncId of the resource, and deletes it if true.
       * @param asyncId - an identifier of the current execution context.
       */
      destroy: (asyncId) => {
        if (CoreContext.store.has(asyncId)) {
          CoreContext.store.delete(asyncId);
        }
      },
    });

    asyncHook.enable();
  }

  /**
   * Method used to create a context, and pass data to be stored.
   * @param data - the data to be stored in the context.
   * @param id - the id of the context, if not provided, a random one will be generated.
   * @returns {ICoreContextPayload<T>} - the payload of the context.
   */
  static create = <T>(
    data: T,
    id: string = crypto.randomBytes(16).toString("hex")
  ): ICoreContextPayload<T> => {
    const info = { id, data };
    CoreContext.store.set(asyncHooks.executionAsyncId(), info);
    return info;
  };

  /**
   * Method used to retrieve the data stored in the context.
   * @returns {ICoreContextPayload<T> | undefined} - the data stored in the context.
   */
  static get = <T>(): ICoreContextPayload<T> | undefined => {
    return CoreContext.store.get(asyncHooks.executionAsyncId());
  };

  /**
   * Method used to find the size of the Map.
   * @returns {number} - the size of the Map.
   */
  static size = (): number => {
    return CoreContext.store.size;
  };
}
