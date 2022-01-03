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
    CoreContext.create = function (id) {
        if (id === void 0) { id = crypto.randomBytes(16).toString("hex"); }
        var asyncId = asyncHooks.executionAsyncId();
        var info = { id: id, asyncId: asyncId, data: {} };
        CoreContext.store.set(asyncId, info);
        return info;
    };
    /**
     * Method used to store data in the context.
     * @param key - the key of the data to be stored.
     * @param data - the data to be stored.
     */
    CoreContext.set = function (data, options) {
        if (options === void 0) { options = { overwrite: true }; }
        var payload = CoreContext.get();
        if (!payload) {
            CoreContext.create();
            payload = CoreContext.get();
        }
        var keys = Object.keys(data);
        if (keys.length) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((typeof payload[key] !== "undefined" &&
                    ((options === null || options === void 0 ? void 0 : options.overwrite) || typeof options.overwrite === "undefined")) ||
                    !payload[key]) {
                    payload[key] = data[key];
                }
            }
            return true;
        }
        return false;
    };
    /**
     * Method used to retrieve the data shared in the context.
     * @param {string} key - the key of the data to be retrieved.
     * @param {number} asyncId - the execution id for any context.
     * @returns {ICoreContextPayload<T> | undefined} the data stored in the context.
     */
    CoreContext.get = function (key, asyncId) {
        if (key === void 0) { key = null; }
        if (asyncId === void 0) { asyncId = asyncHooks.executionAsyncId(); }
        var payload = CoreContext.store.get(asyncId);
        if (!payload) {
            return;
        }
        else {
            if (key) {
                return payload.data[key];
            }
            else {
                return payload.data;
            }
        }
    };
    /**
     * Method used to retrieve the id of the context.
     * @returns {string | null} the id of the context.
     */
    CoreContext.getId = function () {
        var payload = CoreContext.store.get(asyncHooks.executionAsyncId());
        if (!payload) {
            return null;
        }
        else {
            return payload.id;
        }
    };
    /**
     * Method used to delete the data stored in the context.
     * @param key - the key of the data to be removed.
     */
    CoreContext.remove = function (key) {
        var payload = CoreContext.get();
        if (payload) {
            if (key) {
                delete payload[key];
            }
            else {
                var keys = Object.keys(payload);
                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                    var key_1 = keys_2[_i];
                    delete payload[key_1];
                }
            }
        }
    };
    return CoreContext;
}());
exports.CoreContext = CoreContext;
CoreContext.Loader();
//# sourceMappingURL=index.js.map