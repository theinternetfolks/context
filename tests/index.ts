import { CoreContext } from "../src";
import { expect } from "chai";

/**
 * Positive Cases:
 * - should create context with empty data
 * - should store data passed for custom id
 *
 * Negative Cases:
 * - should replace data for further execution in the same method for same ids
 * - should replace data for further execution in child methods for same ids
 * - should replace data for further execution in the same method for different ids
 * - should replace data for further execution in child methods for different ids
 */
describe("create", () => {
  it("should create context with empty data", async () => {
    const tests = [
      {
        name: "test-1",
      },
      {
        name: "test-2",
      },
      {
        name: "test-3",
      },
      {
        name: "test-4",
      },
    ];

    for (const test of tests) {
      const { asyncId } = CoreContext.create();
      const context = CoreContext.store.get(asyncId);
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("id");
      expect(context).to.have.property("data");
    }
  });

  it("should store data passed in store", async () => {
    const tests = [
      {
        name: "test-1",
      },
      {
        name: "test-2",
      },
      {
        name: "test-3",
      },
      {
        name: "test-4",
      },
    ];

    for (const test of tests) {
      const { asyncId } = CoreContext.create(test.name);
      const context = CoreContext.store.get(asyncId);
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("id");
      expect(context).to.have.property("data");
      expect(context.id).to.equal(test.name);
    }
  });

  it("should replace data for further execution in the same method for same ids", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-1",
      title: "Test 2",
    };

    const context1 = CoreContext.create(test1.name);
    CoreContext.set(test1);
    const context2 = CoreContext.create(test2.name);
    CoreContext.set(test2);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult1 = CoreContext.store.get(context1.asyncId);
    const contextResult2 = CoreContext.store.get(context2.asyncId);

    expect(contextResult1).to.not.be.undefined;
    expect(contextResult2).to.not.be.undefined;
    expect(contextResult1).to.have.property("data");
    expect(contextResult2).to.have.property("data");
    expect(contextResult1.data).to.not.deep.equal(test1);
    expect(contextResult1.data).to.deep.equal(test2);
    expect(contextResult2.data).to.deep.equal(test2);
    expect(contextResult2.data).to.not.deep.equal(test1);
  });

  it("should replace data for further execution in child methods for same ids", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-1",
      title: "Test 2",
    };

    const context1 = CoreContext.create(test1.name);
    CoreContext.set(test1);
    const context2 = CoreContext.create(test2.name);
    CoreContext.set(test2);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult1 = CoreContext.store.get(context1.asyncId);
    const contextResult2 = CoreContext.store.get(context2.asyncId);

    expect(contextResult1).to.not.be.undefined;
    expect(contextResult2).to.not.be.undefined;
    expect(contextResult1).to.have.property("data");
    expect(contextResult2).to.have.property("data");
    expect(contextResult1.data).to.not.deep.equal(test1);
    expect(contextResult1.data).to.deep.equal(test2);
    expect(contextResult2.data).to.deep.equal(test2);
    expect(contextResult2.data).to.not.deep.equal(test1);

    /**
     * creating an IIFE to test the child method
     */
    (async () => {
      const context = CoreContext.get();
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context).to.deep.equal(test2);
    })();
  });

  it("should replace data for further execution in the same method for different ids", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-2",
      title: "Test 2",
    };

    const context1 = CoreContext.create(test1.name);
    CoreContext.set(test1);
    const context2 = CoreContext.create(test2.name);
    CoreContext.set(test2);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult1 = CoreContext.store.get(context1.asyncId);
    const contextResult2 = CoreContext.store.get(context2.asyncId);

    expect(contextResult1).to.not.be.undefined;
    expect(contextResult2).to.not.be.undefined;
    expect(contextResult1).to.have.property("data");
    expect(contextResult2).to.have.property("data");
    expect(contextResult1.data).to.not.deep.equal(test1);
    expect(contextResult1.data).to.deep.equal(test2);
    expect(contextResult2.data).to.deep.equal(test2);
    expect(contextResult2.data).to.not.deep.equal(test1);
  });

  it("should replace data for further execution in child methods for different ids", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-2",
      title: "Test 2",
    };

    const context1 = CoreContext.create(test1.name);
    CoreContext.set(test1);
    const context2 = CoreContext.create(test2.name);
    CoreContext.set(test2);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult1 = CoreContext.store.get(context1.asyncId);
    const contextResult2 = CoreContext.store.get(context2.asyncId);

    expect(contextResult1).to.not.be.undefined;
    expect(contextResult2).to.not.be.undefined;
    expect(contextResult1).to.have.property("data");
    expect(contextResult2).to.have.property("data");
    expect(contextResult1.data).to.not.deep.equal(test1);
    expect(contextResult1.data).to.deep.equal(test2);
    expect(contextResult2.data).to.deep.equal(test2);
    expect(contextResult2.data).to.not.deep.equal(test1);

    /**
     * creating an IIFE to test the child method
     */
    (async () => {
      const context = CoreContext.get();
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context).to.deep.equal(test2);
    })();
  });
});

/**
 * Positive Cases
 * - should store data for the given key
 * - should replace data for the same key
 * - should replace data for the same key in child methods
 * - should create context if it is not present, and set the value
 *
 * Negative Cases
 * - should not replace data if overwriting is disabled
 */
describe("set", () => {
  it("should store data for the given key", async () => {
    const test = {
      name: "test-1",
      title: "Test 1",
    };

    const context = CoreContext.create();
    CoreContext.set(test);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult = CoreContext.store.get(context.asyncId);

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.have.property("data");
    expect(contextResult.data).to.deep.equal(test);
  });

  it("should replace data for the same key", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-1",
      title: "Test 2",
    };

    const context = CoreContext.create();
    CoreContext.set(test1);
    CoreContext.set(test2);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult = CoreContext.store.get(context.asyncId);

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.have.property("data");
    expect(contextResult.data).to.not.deep.equal(test1);
    expect(contextResult.data).to.deep.equal(test2);
  });

  it("should replace data for the same key in child methods", async () => {
    const test1 = {
      name: "test-1",
      title: "Test 1",
    };

    const test2 = {
      name: "test-1",
      title: "Test 2",
    };

    const context = CoreContext.create();
    CoreContext.set(test1);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult = CoreContext.store.get(context.asyncId);

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.have.property("data");
    expect(contextResult.data).to.deep.equal(test1);

    /**
     * creating an IIFE to test the child method
     */
    (async () => {
      CoreContext.set(test2);
      const context = CoreContext.get();
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context).to.not.deep.equal(test1);
      expect(context).to.deep.equal(test2);
    })();
  });

  it("should not replace data if overwriting is disabled", async () => {
    {
      const test1 = {
        name: "test-1",
        title: "Test 1",
      };

      const test2 = {
        name: "test-1",
        title: "Test 2",
      };

      const context = CoreContext.create();
      CoreContext.set(test1);
      CoreContext.set(test2, { overwrite: false });

      /**
       * here the asyncId are same, as the execution context is same,
       * which is this method
       */
      const contextResult = CoreContext.store.get(context.asyncId);

      expect(contextResult).to.not.be.undefined;
      expect(contextResult).to.have.property("data");
      expect(contextResult.data).to.deep.equal(test1);
      expect(contextResult.data).to.not.deep.equal(test2);
    }
    {
      const test1 = {
        name: "test-1",
        title: "Test 1",
      };

      const test2 = {
        name: "test-1",
        title: "Test 2",
      };

      const context = CoreContext.create();
      CoreContext.set(test1);
      CoreContext.set(test2);

      /**
       * here the asyncId are same, as the execution context is same,
       * which is this method
       */
      const contextResult = CoreContext.store.get(context.asyncId);

      expect(contextResult).to.not.be.undefined;
      expect(contextResult).to.have.property("data");
      expect(contextResult.data).to.deep.equal(test2);
      expect(contextResult.data).to.not.deep.equal(test1);
    }
    {
      const test1 = {
        name: "test-1",
        title: "Test 1",
      };

      const test2 = {
        name: "test-1",
        title: "Test 2",
      };

      const context = CoreContext.create();
      CoreContext.set(test1);
      CoreContext.set(test2, { overwrite: true });

      /**
       * here the asyncId are same, as the execution context is same,
       * which is this method
       */
      const contextResult = CoreContext.store.get(context.asyncId);

      expect(contextResult).to.not.be.undefined;
      expect(contextResult).to.have.property("data");
      expect(contextResult.data).to.deep.equal(test2);
      expect(contextResult.data).to.not.deep.equal(test1);
    }
  });

  it("should create context if it is not present, and set the value", async () => {
    const test = {
      name: "test-1",
      title: "Test 1",
    };

    expect(CoreContext.get()).to.be.undefined;
    CoreContext.set(test);

    /**
     * here the asyncId are same, as the execution context is same,
     * which is this method
     */
    const contextResult = CoreContext.get();

    expect(contextResult).to.not.be.undefined;
    expect(contextResult).to.deep.equal(test);
  });
});

/**
 * Positive Cases
 * - should return the data for context in the same execution method without specifying the asyncId
 * - should return the data for context in the child execution method without specifying the asyncId
 * - should return data for key present in the store
 *
 * Negative Cases
 * - should return undefined for asyncId which is not present in the store
 */
describe("get", () => {
  it("should return the data for context in the same execution method without specifying the asyncId", () => {
    const tests = [
      {
        name: "test-1",
      },
      {
        name: "test-2",
      },
      {
        name: "test-3",
      },
      {
        name: "test-4",
      },
    ];

    for (const test of tests) {
      CoreContext.create();
      CoreContext.set(test);
      const data = CoreContext.get();
      expect(data).to.not.be.undefined;
      expect(data).to.have.property("name");
      expect(data).to.deep.equal(test);
    }
  });

  it("should return the data for context in the child execution method without specifying the asyncId", () => {
    const test = {
      name: "test-1",
    };

    CoreContext.create();
    CoreContext.set(test);
    const data = CoreContext.get();
    expect(data).to.not.be.undefined;
    expect(data).to.have.property("name");
    expect(data).to.deep.equal(test);

    /**
     * Level: 1
     * creating an IIFE to test the child method
     */
    (() => {
      const context1 = CoreContext.get();
      expect(context1).to.not.be.undefined;
      expect(context1).to.have.property("name");
      expect(context1).to.deep.equal(test);

      /**
       * Level: 2
       * creating an IIFE to test the child method
       */
      (() => {
        const context2 = CoreContext.get();
        expect(context2).to.not.be.undefined;
        expect(context2).to.have.property("name");
        expect(context2).to.deep.equal(test);

        /**
         * Level: 3
         * creating an IIFE to test the child method
         */
        (() => {
          const context3 = CoreContext.get();
          expect(context3).to.not.be.undefined;
          expect(context3).to.have.property("name");
          expect(context3).to.deep.equal(test);
        })();
      })();
    })();
  });

  it("should return data for key present in the store", () => {
    CoreContext.set({ name: "test-1" });
    const context = CoreContext.get("name");
    expect(context).to.be.not.undefined;
    expect(context).to.be.a.string;
    expect(context).to.be.equal("test-1");
  });

  it("should return undefined for key not present in the store", () => {
    const context = CoreContext.get("12345");
    expect(context).to.be.undefined;
  });
});

/**
 * Positive Cases
 * - should return id for context
 *
 * Negative Cases
 * - should return null if context is not present
 */
describe("getId", () => {
  it("should return id for context", () => {
    {
      const context = CoreContext.create();
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("id");
      expect(context.id).to.be.a.string;
      const id = CoreContext.getId();
      expect(id).to.not.be.null;
      expect(id).to.not.be.string;
      expect(id).to.be.equal(context.id);
    }
    {
      const customId = "custom-id";
      const context = CoreContext.create(customId);
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("id");
      expect(context.id).to.be.a.string;
      const id = CoreContext.getId();
      expect(id).to.not.be.null;
      expect(id).to.not.be.string;
      expect(id).to.be.equal(customId);
      expect(id).to.be.equal(context.id);
    }
  });
});

/**
 * Positive Cases
 * - should remove the key if specified
 *
 * Negative Cases
 * - should empty data if no key is specified
 */
describe("remove", () => {
  it("should remove the key if specified", () => {
    const test = {
      name: "test-1",
    };

    CoreContext.create();
    CoreContext.set(test);
    CoreContext.remove("name");
    const context = CoreContext.get();
    expect(context).to.not.have.a.property("name");
    expect(context).to.be.empty;
  });

  it("should empty data if no key is specified", () => {
    const test = {
      name: "test-1",
    };

    CoreContext.create();
    CoreContext.set(test);
    CoreContext.remove();
    const context = CoreContext.get();
    expect(context).to.be.empty;
    expect(context).to.not.have.a.property("name");
  });
});
