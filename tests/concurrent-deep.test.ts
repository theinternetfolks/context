import { describe, it, expect } from "bun:test";
import { Context } from "../src/index";

async function simulateWorkflow(id: string, inputData: any, delay: number = 0) {
  Context.init();
  Context.set({ workflowId: id, data: inputData });

  if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));

  const contextAfterDelay = Context.get();
  const isLeaking =
    Object.keys(contextAfterDelay).length !== 2 ||
    contextAfterDelay.workflowId !== id ||
    contextAfterDelay.data !== inputData;

  return { result: contextAfterDelay, isLeaking };
}

describe("Context Isolation", () => {
  it("should maintain context integrity in sequential runs", async () => {
    const results: {
        result: any;
        isLeaking: boolean;
    }[] = [];
    for (let i = 0; i < 5; i++) {
      results.push(await simulateWorkflow(`seq-${i}`, `data-${i}`));
    }
    expect(results.some(r => r.isLeaking)).toBe(false);
    results.forEach(({ result }, i) => {
      expect(result.workflowId).toBe(`seq-${i}`);
      expect(result.data).toBe(`data-${i}`);
    });
  });

  it("should maintain context integrity in concurrent runs", async () => {
    const promises = Array.from({ length: 5 }, (_, i) => {
      return simulateWorkflow(`concurrent-${i}`, `parallel-data-${i}`, 100 + i * 30);
    });
    const results = await Promise.all(promises);
    expect(results.some(r => r.isLeaking)).toBe(false);
    results.forEach(({ result }, i) => {
      expect(result.workflowId).toBe(`concurrent-${i}`);
      expect(result.data).toBe(`parallel-data-${i}`);
    });
  });

  it("should handle complex data without leakage", async () => {
    await simulateWorkflow("complex-1", { nested: { deeply: { value: "should be isolated" } }, array: [1, 2, 3] });
    const result = await simulateWorkflow("complex-2", "simple value");
    expect(result.isLeaking).toBe(false);
    expect(result.result.workflowId).toBe("complex-2");
    expect(result.result.data).toBe("simple value");
  });

  it("should isolate modified context between workflows", async () => {
    Context.init();
    Context.set({ workflowId: "mod-1", initialData: "test" });
    Context.set({ additionalData: "extra" });

    const midExecutionContext = Context.get();
    expect(midExecutionContext.workflowId).toBe("mod-1");
    expect(midExecutionContext.initialData).toBe("test");
    expect(midExecutionContext.additionalData).toBe("extra");

    Context.init();
    const ctx = Context.get();
    expect(Object.keys(ctx).length).toBe(0);
  });

  it("should execute a function with isolated context", async () => {
    
    const result = await Context.run(async () => {
      Context.set({ key: "value" });
      return Context.get();
    });

    expect(result).toHaveProperty("key", "value");
    // @ts-expect-error
    expect(Context.get()).toEqual({});
  });
});
