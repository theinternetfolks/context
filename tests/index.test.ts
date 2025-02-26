import { describe, it, expect } from 'bun:test';
import { Context } from "../src";

describe("getStore", () => {

  it("should return undefined if no store is set", () => {
    expect(Context.getStore()).toBeUndefined();
  });
  it("should return the current store instance", () => {
    Context.init();
    Context.set({ key: "value" });
    expect(Context.getStore()).toEqual({ key: "value" });
  });

});

describe("init", () => {
  it("should initialize a new context", () => {
    Context.init();
    expect(Context.get()).toBeEmpty();
  });
});

describe("set", () => {
  it("should store data for the given key", async () => {
    const test = {
      name: "test-1",
      title: "Test 1",
    };

    Context.init();
    Context.set(test);

    const contextResult = Context.get();

    expect(contextResult).not.toBeUndefined();
    expect(contextResult).toEqual(test);
  });

  it("should replace data for the same key", async () => {
    const test1 = {
      name: "test-3",
      title: "Test 3",
    };

    const test2 = {
      name: "test-4",
      title: "Test 4",
    };

    Context.init();
    Context.set(test1);
    Context.set(test2);

    const contextResult = Context.get();

    expect(contextResult).not.toBeUndefined();
    expect(contextResult).toEqual(test2);
  });

  it("should replace data for the same key in child methods", async () => {
    const test1 = {
      name: "test-5",
      title: "Test 5",
    };

    const test2 = {
      name: "test-6",
      title: "Test 6",
    };

    Context.init();
    Context.set(test1);

    const contextResult = Context.get();

    expect(contextResult).not.toBeUndefined();
    expect(contextResult).toEqual(test1);

    (async () => {
      Context.set(test2);
      const context = Context.get();
      expect(context).not.toBeUndefined();
      expect(context).toEqual(test2);
    })();
  });

  it("should create context if it is not present, and set the value", async () => {
    const test = {
      name: "test-7",
      title: "Test 7",
    };

    Context.init();
    expect(Context.get()).toBeEmpty();
    Context.set(test);

    const contextResult = Context.get();

    expect(contextResult).not.toBeUndefined();
    expect(contextResult).toEqual(test);
  });
});

describe("get", () => {
  it("should return the data for context in the same execution method", () => {
    const tests = [
      { name: "test-8" },
      { name: "test-9" },
      { name: "test-10" },
      { name: "test-11" },
    ];

    Context.init();
    for (const test of tests) {
      Context.set(test);
      const data = Context.get();
      expect(data).not.toBeUndefined();
      expect(data).toContainKey("name");
      expect(data).toEqual(test);
    }
  });

  it("should return the data for context in the child execution method", () => {
    const test = { name: "test-12" };

    Context.init();

    (async () => {
      Context.set(test);
      const data = Context.get();
      expect(data).not.toBeUndefined();
      expect(data).toContainKey("name");
      expect(data).toEqual(test);
    })();

    (() => {
      const context1 = Context.get();
      expect(context1).not.toBeUndefined();
      expect(context1).toContainKey("name");
      expect(context1).toEqual(test);

      (() => {
        const context2 = Context.get();
        expect(context2).not.toBeUndefined();
        expect(context2).toContainKey("name");
        expect(context2).toEqual(test);

        (() => {
          const context3 = Context.get();
          expect(context3).not.toBeUndefined();
          expect(context3).toContainKey("name");
          expect(context3).toEqual(test);
        })();
      })();
    })();
  });

  it("should return data for key present in the store", () => {
    Context.set({ name: "test-13" });
    const context = Context.get("name");
    expect(context).not.toBeUndefined();
    expect(context).toBeString();
    expect(context).toBe("test-13");
  });

  it("should return undefined for key not present in the store", () => {
    const context = Context.get("12345");
    expect(context).toBeUndefined();
  });
});

describe("remove", () => {
  it("should empty data if no key is specified", () => {
    const test = { name: "test-15" };

    Context.set(test);

    let context = Context.get();
    expect(context).not.toBeEmpty();
    expect(context).toContainKey("name");

    Context.remove();

    context = Context.get();
    expect(context).toBeEmpty;
    expect(context).not.toContainKey("name");
  });
});

