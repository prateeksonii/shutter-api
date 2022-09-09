import jwt from "jsonwebtoken";
import { hash, verify } from "argon2";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { User } from "@prisma/client";
import db from "@/db";
import type { APIResponse } from "@/types/APIResponse";
import type { SignInBody, SignUpBody } from "./validators";
import { getUserFromToken } from "./utils";

export const signUp: RequestHandler = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response<APIResponse<{ user: User }>>,
  next
) => {
  try {
    const { name, password, username } = req.body;

    const existingUser = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      res.status(httpStatus.CONFLICT);
      throw new Error("Username already exists");
    }

    const hashedPassword = await hash(password, { saltLength: 16 });

    const user = await db.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    return res.status(httpStatus.CREATED).json({
      ok: true,
      result: {
        user,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const signIn: RequestHandler = async (
  req: Request<{}, {}, SignInBody>,
  res: Response<APIResponse<{ user: User; token: string }>>,
  next
) => {
  try {
    const { password, username } = req.body;

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      throw new Error("User not found with the given username");
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      res.status(httpStatus.UNAUTHORIZED);
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: "10y",
    });

    return res.json({
      ok: true,
      result: {
        user,
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const isAuthenticated: RequestHandler = (req, res, next) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    if (!user) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error("Missing or invalid token");
    }

    req.user = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

export const getAuthenticatedUser: RequestHandler = (
  req,
  res: Response<APIResponse<{ user: User }>>,
  next
) => {
  return res.json({
    ok: true,
    result: {
      user: req.user!,
    },
  });
};
