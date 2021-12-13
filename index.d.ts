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
export declare class CoreContext {
    /**
     * The Map that stores all the data of the context.
     */
    static store: Map<any, any>;
    /**
     * Method that should be called the first thing, also only once,
     * to enable the library to work, by enabling async hooks.
     */
    static Loader(): void;
    /**
     * Method used to create a context, and pass data to be stored.
     * @param data - the data to be stored in the context.
     * @param id - the id of the context, if not provided, a random one will be generated.
     * @returns {ICoreContextPayload<T>} - the payload of the context.
     */
    static create: <T>(data: T, id?: string) => ICoreContextPayload<T>;
    /**
     * Method used to retrieve the data stored in the context.
     * @returns {ICoreContextPayload<T> | undefined} - the data stored in the context.
     */
    static get: <T>() => ICoreContextPayload<T>;
    /**
     * Method used to find the size of the Map.
     * @returns {number} - the size of the Map.
     */
    static size: () => number;
}
//# sourceMappingURL=index.d.ts.map