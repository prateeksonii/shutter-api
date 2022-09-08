import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { AnyZodObject } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST);
      return next(error);
    }
  };
