// License MIT (https://github.com/theinternetfolks/context/blob/master/LICENSE)
// src/index.ts
import { AsyncLocalStorage } from "async_hooks";

class Context {
  static store = new AsyncLocalStorage;
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
    const newStore = { ...existingStore };
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
    return { ...store };
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
    this.store = new AsyncLocalStorage;
  }
  static create() {
    console.warn("Context.create() is deprecated. Please use Context.init() instead.");
    this.init();
  }
}
var src_default = Context;
export {
  src_default as default,
  Context
};

// With ❤ from the Internet Folks (theinternetfolks.com)
