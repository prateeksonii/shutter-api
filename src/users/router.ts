import { validate } from "@/utils/validator";
import { Router } from "express";
import {
  getAuthenticatedUser,
  isAuthenticated,
  signIn,
  signUp,
} from "./controller";
import { signInValidator, signUpValidator } from "./validators";

const router = Router();

router.post("/", validate(signUpValidator), signUp);
router.post("/signin", validate(signInValidator), signIn);
router.post("/me", isAuthenticated, getAuthenticatedUser);

export default router;
