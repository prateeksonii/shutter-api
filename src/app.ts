import express from "express";
import {
  addInitMiddlewares,
  errorHandler,
  notFoundHandler,
} from "./middlewares";
import usersRouter from "./users/router";

const app = express();

addInitMiddlewares(app);

app.use("/api/v1/users", usersRouter);

app.all("*", notFoundHandler);
app.use(errorHandler);

export default app;
