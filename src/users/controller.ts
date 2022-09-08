import { hash } from "argon2";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { User } from "@prisma/client";
import db from "@/db";
import type { APIResponse } from "@/types/APIResponse";
import type { SignUpBody } from "./validators";

export const signUp: RequestHandler = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response<APIResponse<{ user: User }>>,
  next
) => {
  const { name, password, username } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    res.status(httpStatus.CONFLICT);
    return next(new Error("Username already exists"));
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
};
