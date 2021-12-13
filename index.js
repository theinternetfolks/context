"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreContext = void 0;
var asyncHooks = require("async_hooks");
var crypto = require("crypto");
/**
 * the container interface that keeps the data stored in the Map
 * to be used by the async hooks
 */
var CoreContext = /** @class */ (function () {
    function CoreContext() {
    }
    /* c8 ignore end */
    /* c8 ignore start */
    /**
     * Method that should be called the first thing, also only once,
     * to enable the library to work, by enabling async hooks.
     * @returns {void}
     */
    /* c8 ignore end */
    CoreContext.Loader = function () {
        var asyncHook = asyncHooks.createHook({
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
            init: function (asyncId, _, triggerAsyncId, resource) {
                if (CoreContext.store.has(triggerAsyncId)) {
                    CoreContext.store.set(asyncId, CoreContext.store.get(triggerAsyncId));
                }
            },
            /**
             * The destroy hook is called when an async context is destroyed.
             * The destroy() callback checks if the store has the asyncId of the resource, and deletes it if true.
             * @param asyncId - an identifier of the current execution context.
             */
            destroy: function (asyncId) {
                if (CoreContext.store.has(asyncId)) {
                    CoreContext.store.delete(asyncId);
                }
            },
        });
        asyncHook.enable();
    };
    /* c8 ignore start */
    /**
     * The Map that stores all the data of the context.
     */
    CoreContext.store = new Map();
    /**
     * Method used to create a context, and pass data to be stored.
     * One execution context can have only one context, so calling this method multiple times will overwrite the previous context.
     * If you use this method, in a child function, it would replace the data for this execution context,
     * and the data of the parent execution context would be lost, to further child methods.
     * @param data - the data to be shared in the context.
     * @param id - the user-provided id for the context, if not provided, a random one will be generated. This doesn't have to be necessarily unique.
     * @returns {ICoreContextPayload<T>} the payload of the context.
     */
    CoreContext.create = function (data, id) {
        if (id === void 0) { id = crypto.randomBytes(16).toString("hex"); }
        var asyncId = asyncHooks.executionAsyncId();
        var info = { id: id, asyncId: asyncId, data: data };
        CoreContext.store.set(asyncId, info);
        return info;
    };
    /**
     * Method used to retrieve the data shared in the context.
     * @param asyncId - the execution id for any context.
     * @returns {ICoreContextPayload<T> | undefined} the data stored in the context.
     */
    CoreContext.get = function (asyncId) {
        if (asyncId === void 0) { asyncId = asyncHooks.executionAsyncId(); }
        return CoreContext.store.get(asyncId);
    };
    return CoreContext;
}());
exports.CoreContext = CoreContext;
CoreContext.Loader();
//# sourceMappingURL=index.js.map