import { z } from "zod";

export const signUpValidator = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    username: z.string().min(4, "Username is too short"),
    password: z.string().min(4, "Password is too short"),
  }),
});

export type SignUpBody = z.infer<typeof signUpValidator>["body"];
