import express, {
  ErrorRequestHandler,
  RequestHandler,
  Response,
} from "express";
import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import httpStatus from "http-status";
import { APIErrorResponse, APIResponse } from "./types/APIResponse";

export const addInitMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
};

export const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  next(new Error(`Path: ${req.path} - Not found`));
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res: Response<APIErrorResponse>,
  next
) => {
  if (res.statusCode === httpStatus.OK) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }

  return res.json({
    ok: false,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    },
  });
};
