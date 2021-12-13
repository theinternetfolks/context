import * as asyncHooks from "async_hooks";

import * as crypto from "crypto";

/**
 * the container payload interface that keeps the data stored in the Map
 * @interface ICoreContextPayload
 * @property {string} id - the user-provided id of the context
 * @property {number} asyncId - the id of the current execution context
 * @property {T} data - the data shared in the context
 */
export interface ICoreContextPayload<T> {
  id: string;
  asyncId: number;
  data: T;
}

/**
 * the container interface that keeps the data stored in the Map
 * to be used by the async hooks
 */
export class CoreContext {
  /* c8 ignore start */
  /**
   * The Map that stores all the data of the context.
   */
  static store = new Map();
  /* c8 ignore end */

  /* c8 ignore start */
  /**
   * Method that should be called the first thing, also only once,
   * to enable the library to work, by enabling async hooks.
   * @returns {void}
   */
  /* c8 ignore end */
  static Loader(): void {
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
   * One execution context can have only one context, so calling this method multiple times will overwrite the previous context.
   * If you use this method, in a child function, it would replace the data for this execution context,
   * and the data of the parent execution context would be lost, to further child methods.
   * @param data - the data to be shared in the context.
   * @param id - the user-provided id for the context, if not provided, a random one will be generated. This doesn't have to be necessarily unique.
   * @returns {ICoreContextPayload<T>} the payload of the context.
   */
  static create = <T>(
    data: T,
    id: string = crypto.randomBytes(16).toString("hex")
  ): ICoreContextPayload<T> => {
    const asyncId = asyncHooks.executionAsyncId();
    const info = { id, asyncId, data };
    CoreContext.store.set(asyncId, info);
    return info;
  };

  /**
   * Method used to retrieve the data shared in the context.
   * @param asyncId - the execution id for any context.
   * @returns {ICoreContextPayload<T> | undefined} the data stored in the context.
   */
  static get = <T>(
    asyncId: number = asyncHooks.executionAsyncId()
  ): ICoreContextPayload<T> | undefined => {
    return CoreContext.store.get(asyncId);
  };
}
