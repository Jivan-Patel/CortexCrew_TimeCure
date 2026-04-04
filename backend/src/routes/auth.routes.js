import {Router} from "express"
import * as authController from "../controllers/auth.controller.js"

const authRouter = Router();

// Wrapper for catching async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

authRouter.post("/register", asyncHandler(authController.register))
authRouter.post("/login", asyncHandler(authController.login))
authRouter.get("/get-me", asyncHandler(authController.getMe))
authRouter.get("/refresh-token", asyncHandler(authController.refreshToken))
authRouter.get("/logout", asyncHandler(authController.logOut))
authRouter.get("/logout-all", asyncHandler(authController.logOutAll))
authRouter.get("/has-admin", asyncHandler(authController.checkAdmin))

export default authRouter;  