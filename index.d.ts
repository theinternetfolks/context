/// <reference types="node" />
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
export declare class Context {
    static store: AsyncLocalStorage<IContextPayload>;
    static Loader(): void;
    /**
     * Method used to store data in the context.
     * @param {object} data - the data to be stored.
     * @param {object} [options] - options for data to be stored.
     * @param {boolean} [options.overwrite] - if false, does not overwrite the data if key already exists.
     * @returns {boolean} - true if the data was set succesfully, false otherwise.
     */
    static set: (data: Record<string, any>) => boolean;
    /**
     * Method used to retrieve the data shared in the context.
     * @param {string} key - the key of the data to be retrieved.
     * @returns {T | undefined} the data stored in the context.
     */
    static get: <T>(key?: string | null) => T;
    /**
     * Method used to delete the data stored in the context.
     * @param {string} [key] - the key of the data to be removed.
     */
    static remove: (key?: string) => void;
}
export {};
//# sourceMappingURL=index.d.ts.map