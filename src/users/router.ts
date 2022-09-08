import { validate } from "@/utils/validator";
import { Router } from "express";
import { signUp } from "./controller";
import { signUpValidator } from "./validators";

const router = Router();

router.post("/", validate(signUpValidator), signUp);

export default router;
