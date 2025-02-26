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
export declare class Context {
    /**
     * The internal AsyncLocalStorage instance
     * Initialized immediately to remove the need for a Loader function
     */
    private static store;
    /**
     * Initialize a new empty context
     * More explicit alternative to Context.set({})
     */
    static init(): void;
    /**
     * Get the store
     */
    static getStore(): IContextPayload;
    /**
     * Run a function with an isolated context
     * Optional method for explicit context isolation
     *
     * @param fn Function to execute with isolated context
     * @param initialData Optional initial context data
     * @returns The result of the function execution
     */
    static run<T>(fn: () => T | Promise<T>, initialData?: IContextPayload): T | Promise<T>;
    /**
     * Method used to store data in the context.
     * @param {object} data - the data to be stored.
     * @returns {boolean} - true if the data was set successfully, false otherwise.
     */
    static set(data: IContextPayload): boolean;
    /**
     * Method used to retrieve the data shared in the context.
     * @param {string} key - the key of the data to be retrieved.
     * @returns {T | undefined} the data stored in the context.
     */
    static get<T = any>(key?: string | null): T | undefined;
    /**
     * Method used to delete the data stored in the context.
     * @param {string} [key] - the key of the data to be removed.
     */
    static remove(key?: string): void;
    /**
     * @deprecated Use Context.init() instead
     * Kept for backward compatibility with existing code
     */
    static Loader(): void;
    /**
     * @deprecated Use Context.init() instead
     * Kept for backward compatibility with existing code
     */
    static create(): void;
}
export default Context;
