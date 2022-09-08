import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares";

const app = express();

app.all("*", notFoundHandler);
app.use(errorHandler);

export default app;
