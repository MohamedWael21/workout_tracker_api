import { validateLoginBody, validateRefreshTokenBody, validateSignupBody } from "./../middleware/auth_validation";
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth";
const authRouter = Router();

authRouter.post("/signup", validateSignupBody, authController.signup);
authRouter.post("/login", validateLoginBody, authController.login);
authRouter.post("/refresh-token", validateRefreshTokenBody, authController.refreshToken);
authRouter.post("/logout", isAuth, authController.logout);

export default authRouter;
