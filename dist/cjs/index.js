// License MIT (https://github.com/theinternetfolks/context/blob/master/LICENSE)
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  default: () => src_default,
  Context: () => Context
});
module.exports = __toCommonJS(exports_src);
var import_async_hooks = require("async_hooks");

class Context {
  static store = new import_async_hooks.AsyncLocalStorage;
  static init() {
    this.store.enterWith({});
  }
  static getStore() {
    return Context.store.getStore();
  }
  static run(fn, initialData = {}) {
    return this.store.run({ ...initialData }, fn);
  }
  static set(data) {
    if (!data || typeof data !== "object") {
      return false;
    }
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return false;
    }
    const existingStore = this.store.getStore();
    if (!existingStore) {
      this.store.enterWith({ ...data });
      return true;
    }
    const newStore = existingStore;
    for (const key of keys) {
      if (typeof data[key] !== "undefined") {
        newStore[key] = data[key];
      }
    }
    this.store.enterWith(newStore);
    return true;
  }
  static get(key = null) {
    const store = this.store.getStore();
    if (!store) {
      return;
    }
    if (key) {
      return store[key];
    }
    return store;
  }
  static remove(key) {
    const store = this.store.getStore();
    if (!store) {
      return;
    }
    const newStore = { ...store };
    if (key) {
      delete newStore[key];
    } else {
      for (const k of Object.keys(newStore)) {
        delete newStore[k];
      }
    }
    this.store.enterWith(newStore);
  }
  static Loader() {
    console.warn("Context.Loader() is deprecated. You can safely remove it from your code.");
    this.store = new import_async_hooks.AsyncLocalStorage;
  }
  static create() {
    console.warn("Context.create() is deprecated. Please use Context.init() instead.");
    this.init();
  }
}
var src_default = Context;

// With ❤ from the Internet Folks (theinternetfolks.com)
