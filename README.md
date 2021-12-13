# @theinternetfolks/context

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
    CoreContext.create(originalData)
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
    const { data } = CoreContext.get()
    useTheOriginalDataFinally(data)
}
```

The library uses [Async Hooks](https://nodejs.org/api/async_hooks.html#async_hooks_async_hooks) internally. Async Hooks are a core module in Node.js that provides an API to track the lifetime of asynchronous resources in a Node application. An asynchronous resource can be thought of as an object that has an associated callback.

Examples include, but are not limited to: `Promises`, `Timeouts`, `TCPWrap`, `UDP` etc. The whole list of asynchronous resources that we can track using this API can be found [here](https://nodejs.org/api/async_hooks.html#async_hooks_type).

## Installation

Install with npm

```bash
  npm install @theinternetfolks/context
```

Install with yarn

```bash
  yarn add @theinternetfolks/context
```

## Features

- Lightweight-implementation using the native `Map` structure
- Typescript typings with your interfaces
- Works for all kind of async functions - `tim

## Usage/Examples

#### Example 1

Usage in `Express.js` to create a per-request context.

The data in the created context will **only** be accessible to that particular request.

```javascript
import express from "express";

import { CoreContext } from "@theinternetfolks/context";

// a one-time function call used to enable async hooks
CoreContext.Loader();


// some example function calls
export const doEpicShit = async (): Promise<void> => {
  const context = CoreContext.get();
  // Logs to the Id generated during creationg
  console.log(context?.id);
};

const doSomething = async () => {
  const context = CoreContext.get();

  // works for async/await
  await doEpicShit();

  // works timeouts as well
  setTimeout(() => {
    doEpicShit();
  }, 1500);
};


// declaring custom interfaces that can be reused
interface IPayload {
    host: string;
}


// starting the express server
const app = express();

app.use(express.json());

app.use("/", async (req, res, next) => {
  const data = { host: req.get("host") };
  CoreContext.create<IPayload>(data);
  next();
});

app.get("/", async (req, res) => {
  const context = CoreContext.get<IPayload>();
  doSomething();
  return res.json(context?.id);
});


// starting the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

```

## Documentation

#### Table of Content

- `store: Map<any, any>;`
  The Map that stores all the data of the context.

- `Loader(): void;`
  Method used to call the first thing only once, to enable the library to work.

- `create: <T>(data: T, id?: string) => ICoreContextPayload<T>;`
  Method used to create a context, and pass data to be stored.

- `get: <T>() => ICoreContextPayload<T>;`
  Method used to retrieve the data stored in the context.

**Known Behavior:**

As a side-effect of how the Async Hooks execution works,

## Authors

- Sameer Khan ([@monkfromearth](https://www.github.com/monkfromearth))

The authors are indebted to [Allan Mogusu](https://twitter.com/AllanMogusu), the original author of the [article](https://stackabuse.com/using-async-hooks-for-request-context-handling-in-node-js/) that inspired the library.
