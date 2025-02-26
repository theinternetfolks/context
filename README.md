[![The Internet Folks Logo](https://www.theinternetfolks.com/svg/tiflogo.svg)](https://theinternetfolks.com)

# @theinternetfolks/context

[![GitHub license](https://img.shields.io/github/license/theinternetfolks/context.svg)](https://github.com/theinternetfolks/context/blob/master/LICENSE)
[![Maintainer](https://img.shields.io/badge/maintainer-monkfromearth-green)](https://github.com/monkfromearth)

Library to help you create a context that can be used to reference data, without prop drilling, in Node-based environments.

The inspiration comes from the concept of [Context](https://reactjs.org/docs/context.html) in React.

> Prop drilling is the process of getting data from component A to component Z by passing it through multiple layers of intermediary React components. Instead of manually passing props down, Context provides a way to share values between components.

Passing data to child functions in Node-based environments is a challenge. You could use a static class that works as your storage, but in cases where the application might be accessed in parallel, this approach fails. There is a definite need for a context-like concept.

Instead of doing this:

```javascript
callFunction1(originalData) {
    callFunction2(someData, originalData);
}

callFunction2(someData, originalData) {
    processOtherDataToo(someData);
    callFunction3(originalData);
}

callFunction3(originalData) {
    callFunction4(originalData);
}

callFunction4(originalData) {
    useTheOriginalDataFinally(originalData);
}
```

You can do this:

```javascript
callFunction1(originalData) {
    Context.set(originalData);
    callFunction2(someData);
}

callFunction2(someData) {
    processOtherDataToo(someData);
    callFunction3();
}

callFunction3() {
    callFunction4();
}

callFunction4() {
    const data = Context.get();
    useTheOriginalDataFinally(data);
}
```

The library uses [Async Local Storage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) internally, which provides an API to track the lifetime of asynchronous resources in a Node application.

## Installation

Install with npm:

```bash
npm install @theinternetfolks/context
```

Install with pnpm:

```bash
pnpm add @theinternetfolks/context
```

Install with bun:

```bash
bun add @theinternetfolks/context
```

Install with yarn:

```bash
yarn add @theinternetfolks/context
```

## Features

- Lightweight implementation using native `AsyncLocalStorage`
- TypeScript typings with interfaces support
- Works with all kinds of async functions (`Promises`, `Timeouts`, `TCPWrap`, `UDP`, etc.)

## Usage/Examples

### Example 1: Simple Function Call

```javascript
const { Context } = require("@theinternetfolks/context");

const SomeFunction = () => {
  const data = Context.get();
  console.log(`Name: ${data.name}`);
};

(() => {
  Context.init();
  Context.set({ name: "The Internet Folks" });
  SomeFunction();
})();
```

**Output**:
```bash
Name: The Internet Folks
```

### Example 2: Parent-Child Function Calls

```javascript
const { Context } = require("@theinternetfolks/context");

const ChildFunction = () => {
  const data = Context.get();
  console.log(`Name from Context: ${data.name} in Child`);
};

const ParentFunction = () => {
  const data = Context.get();
  console.log(`Name from Context: ${data.name} in Parent`);
  ChildFunction();
};

(() => {
  Context.init();
  Context.set({ name: "The Internet Folks" });
  ParentFunction();
})();
```

### Example 3: Usage in Express.js (Per-Request Context)

```javascript
const express = require("express");
const { Context } = require("@theinternetfolks/context");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  Context.init();
  Context.set({ host: req.get("host") });
  next();
});

app.get("/", (req, res) => {
  const data = Context.get();
  return res.json({ host: data?.host });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Example 4: Express.js with TypeScript

```typescript
import express from "express";
import { Context } from "@theinternetfolks/context";

interface IPayload {
    host: string;
}

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  Context.init();
  Context.set({ host: req.get("host") });
  next();
});

app.get("/", (req, res) => {
  const context = Context.get<IPayload>();

  setTimeout(() => {
    console.log(context?.host);
  }, 2500);

  return res.json({ host: context?.host });
});

app.listen(6174, () => {
  console.log("Server running on port 6174");
});
```

## Documentation

#### API Methods

- `static init(): void;`
  Initializes a new context. This **must** be called before setting data.

- `static get<T>(key?: string | null): T;`
  Retrieves the stored data in the context.

- `static set(data: Record<string, any>): boolean;`
  Stores data in the context.

- `static remove(key?: string): void;`
  Deletes the data stored in the context.

## Tests

- Uses Mocha with Chai for unit testing.
- Load tested with k6 to ensure no data leakage across requests.

[Test Coverage](https://theinternetfolks.github.io/context/coverage/)

## Authors

- Sameer Khan ([@monkfromearth](https://www.github.com/monkfromearth))

