import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const getUserFromToken = (authorization?: string) => {
  if (!authorization) {
    return null;
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return null;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { user: User };

  return payload.user;
};
