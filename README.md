[![The Internet Folks Logo](https://theinternetfolks.com/assets/images/logo.png)](https://theinternetfolks.com)

# @theinternetfolks/context

[![GitHub license](https://img.shields.io/github/license/theinternetfolks/context.svg)](https://github.com/theinternetfolks/context/blob/master/LICENSE)
[![Maintainer](https://img.shields.io/badge/maintainer-monkfromearth-green)](https://github.com/monkfromearth)
![Works on Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Works on TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Library to help you create a context that can be used to reference data, without prop drilling, in Node-based environments.

The inspiration comes from the concept of [Context](https://reactjs.org/docs/context.html) in React.

> Prop drilling is the processing of getting data from component A to component Z by passing it through multiple layers of intermediary React components. Component will receive props indirectly and you, the React Developer will have to ensure everything works out right.
> ~ [TopTal](https://www.toptal.com/react/react-context-api)

Passing data to child functions in Node-based environments is a challenge. You could use a static class that works as your Storage, but in places where the application might be accessed parallely, the idea fails miserably. There is definitely a need for concept of context.

So instead of doing this:

```javascript

callFunction1(originalData){
    callFunction2(someData, originalData)
}

callFunction2(someData, originalData){
    // some unit of work here
    processOtherDataToo(someData)
    callFunction3(originalData)
}

callFunction3(originalData){
    // some unit of work here
    callFunction4(originalData)
}

callFunction4(originalData){
    useTheOriginalDataFinally(originalData)
}

```

What you could simply do is:

```javascript

callFunction1(originalData){
    Context.set(originalData)
    callFunction2(someData)
}

callFunction2(someData){
    // some unit of work here
    processOtherDataToo(someData)
    callFunction3()
}

callFunction3(){
    // some unit of work here
    callFunction4()
}

callFunction4(){
    // Use the original data finally for any kind of work
    const data = Context.get()
    useTheOriginalDataFinally(data)
}
```

The library uses [Async Local Storage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) internally. Async Local Storage are a core module in Node.js that provides an API to track the lifetime of asynchronous resources in a Node application. An asynchronous resource can be thought of as an object that has an associated callback.

## Installation

Install with npm

```bash
  npm install @theinternetfolks/context
```

Install with yarn

```bash
  yarn add @theinternetfolks/context
```

Install with bun

```bash
  bun add @theinternetfolks/context
```

## Features

- Lightweight-implementation using the native `AsyncLocalStoage` structure
- Typescript typings with your interfaces
- Works for all kind of async functions - `Promises`, `Timeouts`, `TCPWrap`, `UDP` etc.

## Usage/Examples

#### Example 1

Simple usage in a simple function call based Node script.

```javascript
const { Context } = require("@theinternetfolks/context");

const SomeFunction = () => {
  const data = Context.get();
  console.log(`Name: ${data.name}`);
};

(() => {
  Context.set({ name: "The Internet Folks" });
  SomeFunction();
})();
```

**Output**:

```bash
Name: The Internet Folks
```

#### Example 2

Simple Parent-Child function usage in a nested function call based Node script.

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
  // You could use create and set separately
  Context.create();
  Context.set({ name: "The Internet Folks" });
  ParentFunction();
})();
```

**Output**:

```bash
Name from Context: The Internet Folks in Parent
Name from Context: The Internet Folks in Child
```

#### Example 3

Usage in `Express.js` to create a per-request context.

The data in the created context will **only** be accessible to that particular request.

```javascript
const express = require("express");

const { Context } = require("@theinternetfolks/context");

// starting the express server
const app = express();

app.use(express.json());

app.use("/", async (request, response, next) => {
  Context.set({ host: request.get("host") });
  next();
});

app.get("/", (request, response) => {
  const data = Context.get();
  return response.json(data?.host);
});

// starting the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

#### Example 4

Usage in `Express.js` with Typescript (and interfaces) to create a per-request context.

The data in the created context will **only** be accessible to that particular request.

```javascript
import express from "express";

import Context from "@theinternetfolks/context";


// declaring custom interfaces that can be reused
interface IPayload {
    host: string;
}


// starting the express server
const app = express();

app.use(express.json());

app.use("/", async (request, response, next) => {
  Context.set({ host: request.get("host") });
  next();
});

app.get("/", (request, response) => {
  const context = Context.get<IPayload>();

  // works timeouts as well
  setTimeout(() => {
    console.log(context?.host)
  }, 2500);

  return response.json(context?.host);
});


// starting the server
app.listen(6174, () => {
  console.log("Server running on port 6174");
});

```

## Documentation

#### Table of Content

- `static get: <T>(key?: string | null) => T;`
  Method used to retrieve the data stored in the context.

- `static set: (data: Record<string, any>) => boolean;`
  Method used to store data in the context.

- `static remove: (key?: string) => void;`
  Method used to delete the data stored in the context.

**Internal variables and methods**

These are handled internally by the library, and doesn't require your intervention.

- `store: AsyncLocalStorage<IContextPayload>;`
  The Map that stores all the data of the context.

- `Loader(): void;`
  Method used to call the first thing only once, to enable the library to work.

**Known Behavior**

1. As a side-effect of how the Async Hooks execution works, we know that only context is stored per execution, which by the application of the library is shared across the child methods. This means that if you call `get` in a child method, it will return the same data as the parent method. But, if you call `Loader()` again, it will essentially replace data for the same execution method, as well as the child methods.

In a further version, we will add a method to disable this behavior, if warranted.

2. Changing the context as an object anywhere, will essentially change the source object for the context. This means the following code can cause side effects elsewhere:

```javascript
// File 1 (executed first)

const context = Context.get();

context.something = 1;

// File 2 (executed later)

const context = Context.get();

console.log(context.something);
// prints 1
```

Thus, care should be taken when changing the context object. **Only** use set, and get method for changing the context object.

#### Tests

- Used Mocha with Chai as Unit Tests
- k6 was used to load test, to check if library was leaking data beyond a request (10000vus)

[Test Coverage](https://theinternetfolks.github.io/context/coverage/)

## Authors

- Sameer Khan ([@monkfromearth](https://www.github.com/monkfromearth))
