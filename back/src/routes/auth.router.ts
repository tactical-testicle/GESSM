import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router()
const autController = new AuthController()


authRouter.post('/register',autController.register.bind(autController))
authRouter.post('/login',autController.login.bind(autController))


export default authRouter