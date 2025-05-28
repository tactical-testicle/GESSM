import UserController from '../controllers/user.controller';
import { Router, Request, Response } from "express";

const userRouter = Router()
const userController = new UserController()

userRouter.post('/create', userController.createUser.bind(userController))
userRouter.get('/reads', userController.getUsers.bind(userController))
userRouter.get('/read', userController.getUserById.bind(userController))
userRouter.get('/reads/adminUsers', userController.getAdminUsers.bind(userController))
userRouter.post('/update', userController.updateUser.bind(userController))
userRouter.post('/delete', userController.deleteUser.bind(userController))

export default userRouter;
