import { describe, it, beforeEach } from 'bun:test';
import { expect } from 'chai';
import { Context } from "../src";


describe("init", () => {
  it("should initialize a new context", () => {
    Context.init();
    expect(Context.get()).to.deep.equal({});
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

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.deep.equal(test);
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

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.deep.equal(test2);
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

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.deep.equal(test1);

    (async () => {
      Context.set(test2);
      const context = Context.get();
      expect(context).to.not.be.undefined;
      expect(context).to.deep.equal(test2);
    })();
  });

  it("should create context if it is not present, and set the value", async () => {
    const test = {
      name: "test-7",
      title: "Test 7",
    };

    Context.init();
    expect(Context.get()).to.deep.equal({});
    Context.set(test);

    const contextResult = Context.get();

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.deep.equal(test);
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
      expect(data).to.not.be.undefined;
      expect(data).to.have.property("name");
      expect(data).to.deep.equal(test);
    }
  });

  it("should return the data for context in the child execution method", () => {
    const test = { name: "test-12" };

    Context.init();

    (async () => {
      Context.set(test);
      const data = Context.get();
      expect(data).to.not.be.undefined;
      expect(data).to.have.property("name");
      expect(data).to.deep.equal(test);
    })();

    (() => {
      const context1 = Context.get();
      expect(context1).to.not.be.undefined;
      expect(context1).to.have.property("name");
      expect(context1).to.deep.equal(test);

      (() => {
        const context2 = Context.get();
        expect(context2).to.not.be.undefined;
        expect(context2).to.have.property("name");
        expect(context2).to.deep.equal(test);

        (() => {
          const context3 = Context.get();
          expect(context3).to.not.be.undefined;
          expect(context3).to.have.property("name");
          expect(context3).to.deep.equal(test);
        })();
      })();
    })();
  });

  it("should return data for key present in the store", () => {
    Context.set({ name: "test-13" });
    const context = Context.get("name");
    expect(context).to.be.not.undefined;
    expect(context).to.be.a.string;
    expect(context).to.be.equal("test-13");
  });

  it("should return undefined for key not present in the store", () => {
    const context = Context.get("12345");
    expect(context).to.be.undefined;
  });
});

describe("remove", () => {
  it("should empty data if no key is specified", () => {
    const test = { name: "test-15" };

    Context.set(test);

    let context = Context.get();
    expect(context).to.not.be.empty;
    expect(context).to.have.a.property("name");

    Context.remove();

    context = Context.get();
    expect(context).to.be.empty;
    expect(context).to.not.have.a.property("name");
  });
});

describe("getStore", () => {
  it("should return the current store instance", () => {
    Context.init();
    Context.set({ key: "value" });
    expect(Context.getStore()).to.deep.equal({ key: "value" });
  });

  it("should return undefined if no store is set", () => {
    Context.init();
    expect(Context.getStore()).to.deep.equal({});
  });
});
