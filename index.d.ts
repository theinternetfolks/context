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
export declare class CoreContext {
    /**
     * The Map that stores all the data of the context.
     */
    static store: Map<any, any>;
    /**
     * Method that should be called the first thing, also only once,
     * to enable the library to work, by enabling async hooks.
     * @returns {void}
     */
    static Loader(): void;
    /**
     * Method used to create a context, and pass data to be stored.
     * One execution context can have only one context, so calling this method multiple times will overwrite the previous context.
     * If you use this method, in a child function, it would replace the data for this execution context,
     * and the data of the parent execution context would be lost, to further child methods.
     * @param data - the data to be shared in the context.
     * @param id - the user-provided id for the context, if not provided, a random one will be generated. This doesn't have to be necessarily unique.
     * @returns {ICoreContextPayload<T>} the payload of the context.
     */
    static create: <T>(data: T, id?: string) => ICoreContextPayload<T>;
    /**
     * Method used to retrieve the data shared in the context.
     * @param asyncId - the execution id for any context.
     * @returns {ICoreContextPayload<T> | undefined} the data stored in the context.
     */
    static get: <T>(asyncId?: number) => ICoreContextPayload<T>;
}
//# sourceMappingURL=index.d.ts.map