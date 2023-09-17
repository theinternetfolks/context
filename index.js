"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_hooks_1 = require("async_hooks");
/**
 * the container interface that keeps the data stored in the Map
 * to be used by the async hooks
 */
/* c8 ignore start */
var Context = /** @class */ (function () {
    function Context() {
    }
    /* c8 ignore end */
    Context.Loader = function () {
        /**
         * The storage that stores all the data of the context.
         */
        this.store = new async_hooks_1.AsyncLocalStorage();
    };
    var _a;
    _a = Context;
    /**
     * Method used to store data in the context.
     * @param {object} data - the data to be stored.
     * @param {object} [options] - options for data to be stored.
     * @param {boolean} [options.overwrite] - if false, does not overwrite the data if key already exists.
     * @returns {boolean} - true if the data was set succesfully, false otherwise.
     */
    Context.set = function (data) {
        var payload = _a.store.getStore();
        if (!payload) {
            _a.store.enterWith(data);
            return true;
        }
        var keys = Object.keys(data);
        if (keys.length) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (typeof payload[key] !== "undefined") {
                    payload[key] = data[key];
                }
            }
            _a.store.enterWith(payload);
            return true;
        }
        return false;
    };
    /**
     * Method used to retrieve the data shared in the context.
     * @param {string} key - the key of the data to be retrieved.
     * @returns {T | undefined} the data stored in the context.
     */
    Context.get = function (key) {
        if (key === void 0) { key = null; }
        var payload = _a.store.getStore();
        if (!payload) {
            return;
        }
        else {
            if (key) {
                return payload[key];
            }
            else {
                return payload;
            }
        }
    };
    /**
     * Method used to delete the data stored in the context.
     * @param {string} [key] - the key of the data to be removed.
     */
    Context.remove = function (key) {
        var payload = _a.store.getStore();
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
            _a.store.enterWith(payload);
        }
    };
    return Context;
}());
exports.default = Context;
//# sourceMappingURL=index.js.map