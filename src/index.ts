import { AsyncLocalStorage } from "async_hooks";

/**
 * the container payload interface that keeps the data stored in the Map
 * @interface IContextPayload
 * @property {string} id - the user-provided id of the context
 * @property {T} data - the data shared in the context
 */
type IContextPayload = Record<string, any>;

/**
 * Context - Secure storage to share data across functions without prop drilling
 * Provides thread-local storage for Node.js applications using AsyncLocalStorage
 */
export class Context {
  /**
   * The internal AsyncLocalStorage instance
   * Initialized immediately to remove the need for a Loader function
   */
  private static store = new AsyncLocalStorage<IContextPayload>();

  /**
   * Initialize a new empty context
   * More explicit alternative to Context.set({})
   */
  static init(): void {
    this.store.enterWith({});
  }

  /**
   * Get the store
   */
  static getStore(): IContextPayload {
    return Context.store.getStore();
  }

  /**
   * Run a function with an isolated context
   * Optional method for explicit context isolation
   * 
   * @param fn Function to execute with isolated context
   * @param initialData Optional initial context data
   * @returns The result of the function execution
   */
  static run<T>(fn: () => T | Promise<T>, initialData: IContextPayload = {}): T | Promise<T> {
    return this.store.run({ ...initialData }, fn);
  }

  /**
   * Method used to store data in the context.
   * @param {object} data - the data to be stored.
   * @returns {boolean} - true if the data was set successfully, false otherwise.
   */
  static set(data: IContextPayload): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
      return false;
    }

    const existingStore = this.store.getStore();

    // If no store exists, create a new one
    if (!existingStore) {
      this.store.enterWith({ ...data });
      return true;
    }

    // Create a new copy of the store to prevent reference issues
    const newStore = { ...existingStore };
    
    // Update with new data
    for (const key of keys) {
      if (typeof data[key] !== "undefined") {
        newStore[key] = data[key];
      }
    }
    
    // Replace the store with the updated version
    this.store.enterWith(newStore);
    return true;
  }

  /**
   * Method used to retrieve the data shared in the context.
   * @param {string} key - the key of the data to be retrieved.
   * @returns {T | undefined} the data stored in the context.
   */
  static get<T = any>(key: string | null = null): T | undefined {
    const store = this.store.getStore();
    
    if (!store) {
      return undefined;
    }

    if (key) {
      return store[key] as T;
    }
    
    // Return a shallow copy to prevent direct modification
    return { ...store } as T;
  }

  /**
   * Method used to delete the data stored in the context.
   * @param {string} [key] - the key of the data to be removed.
   */
  static remove(key?: string): void {
    const store = this.store.getStore();
    
    if (!store) {
      return;
    }

    // Create a new copy of the store
    const newStore = { ...store };
    
    if (key) {
      // Remove specific key
      delete newStore[key];
    } else {
      // Clear all keys
      for (const k of Object.keys(newStore)) {
        delete newStore[k];
      }
    }

    // Replace the store with the updated version
    this.store.enterWith(newStore);
  }

  /**
   * @deprecated Use Context.init() instead
   * Kept for backward compatibility with existing code
   */
  static Loader(): void {
    console.warn('Context.Loader() is deprecated. You can safely remove it from your code.');
    this.store = new AsyncLocalStorage<IContextPayload>();
  }

  /**
   * @deprecated Use Context.init() instead
   * Kept for backward compatibility with existing code
   */
  static create(): void {
    console.warn('Context.create() is deprecated. Please use Context.init() instead.');
    this.init();
  }
}

// For compatibility with both import styles
export default Context;