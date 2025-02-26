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
  });

  it("should maintain context integrity in concurrent runs", async () => {
    const promises = Array.from({ length: 5 }, (_, i) => {
      return simulateWorkflow(`concurrent-${i}`, `parallel-data-${i}`, 100 + i * 30);
    });
    const results = await Promise.all(promises);
    expect(results.some(r => r.isLeaking)).toBe(false);
  });

  it("should handle complex data without leakage", async () => {
    await simulateWorkflow("complex-1", { nested: { deeply: { value: "should be isolated" } }, array: [1, 2, 3] });
    const result = await simulateWorkflow("complex-2", "simple value");
    expect(result.isLeaking).toBe(false);
  });

  it("should isolate modified context between workflows", async () => {
    Context.init();
    Context.set({ workflowId: "mod-1", initialData: "test" });
    Context.set({ additionalData: "extra" });

    Context.init();
    const ctx = Context.get();
    expect(Object.keys(ctx).length).toBe(0);
  });
});
