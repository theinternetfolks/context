import { CoreContext } from "../src";
import { expect } from "chai";

before(() => {
  CoreContext.Loader();
});

/**
 * Positive Cases:
 * - should store data passed in store
 * - should store data passed for custom id
 *
 * Negative Cases:
 * - should replace data for further execution in the same method for same ids
 * - should replace data for further execution in child methods for same ids
 * - should replace data for further execution in the same method for different ids
 * - should replace data for further execution in child methods for different ids
 */
describe("create", () => {
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
      const { asyncId } = CoreContext.create(test);
      const context = CoreContext.store.get(asyncId);
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context.data).to.deep.equal(test);
    }
  });

  it("should store data passed for custom id", async () => {
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
      const { asyncId } = CoreContext.create(test, test.name);
      const context = CoreContext.store.get(asyncId);
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context.data).to.deep.equal(test);
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

    const context1 = CoreContext.create(test1, test1.name);
    const context2 = CoreContext.create(test2, test2.name);

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

    const context1 = CoreContext.create(test1, test1.name);
    const context2 = CoreContext.create(test2, test2.name);

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
      expect(context.data).to.deep.equal(test2);
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

    const context1 = CoreContext.create(test1, test1.name);
    const context2 = CoreContext.create(test2, test2.name);

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

    const context1 = CoreContext.create(test1, test1.name);
    const context2 = CoreContext.create(test2, test2.name);

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
      expect(context.data).to.deep.equal(test2);
    })();
  });
});

/**
 * Positive Cases
 * - should return the data for context in the same execution method without specifying the asyncId
 * - should return the data for context in the child execution method without specifying the asyncId
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
      CoreContext.create(test);
      const context = CoreContext.get();
      expect(context).to.not.be.undefined;
      expect(context).to.have.property("data");
      expect(context.data).to.deep.equal(test);
    }
  });

  it("should return the data for context in the child execution method without specifying the asyncId", () => {
    const test = {
      name: "test-1",
    };

    CoreContext.create(test);
    const context = CoreContext.get();
    expect(context).to.not.be.undefined;
    expect(context).to.have.property("data");
    expect(context.data).to.deep.equal(test);

    /**
     * Level: 1
     * creating an IIFE to test the child method
     */
    (() => {
      const context1 = CoreContext.get();
      expect(context1).to.not.be.undefined;
      expect(context1).to.have.property("data");
      expect(context1.data).to.deep.equal(test);

      /**
       * Level: 2
       * creating an IIFE to test the child method
       */
      (() => {
        const context2 = CoreContext.get();
        expect(context2).to.not.be.undefined;
        expect(context2).to.have.property("data");
        expect(context2.data).to.deep.equal(test);

        /**
         * Level: 3
         * creating an IIFE to test the child method
         */
        (() => {
          const context3 = CoreContext.get();
          expect(context3).to.not.be.undefined;
          expect(context3).to.have.property("data");
          expect(context3.data).to.deep.equal(test);
        })();
      })();
    })();
  });

  it("should return undefined for asyncId which is not present in the store", () => {
    const context = CoreContext.get(12345);
    expect(context).to.be.undefined;
  });
});
