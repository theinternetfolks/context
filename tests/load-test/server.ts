import express from "express";

import { Context } from "../../src";

// declaring custom interfaces that can be reused
interface IPayload {
  value: string;
}

// starting the express server
const app = express();

app.use(express.json());

app.use(async (request, response, next) => {
  Context.init();
  Context.set({ value: request.query.value });
  return next();
});

app.get("/", (request, response) => {
  const context = Context.get<IPayload>();
  return response.send(context?.value);
});

// starting the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
