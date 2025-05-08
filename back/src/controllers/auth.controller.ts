import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { AuthService } from "../services/auth.service";

export default class AuthController {
    async register(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body) {
                return ResponseHelper.error(res, 'Please provide user data', null, 400);
            }

            const user = await AuthService.register(req.body);

            if (!user?.ok) {
                return ResponseHelper.error(res,user.message, user?.createdUser, user?.code);
            }

            return ResponseHelper.success(res, 'User created successfully', user, 201);
        } catch (error) {
            logger.error(`[Error/controller/register]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async login(req: Request, res: Response):Promise<any>{
        try{
            const {email, password} = req.body
            const result = await AuthService.login(email, password)
            return ResponseHelper.success(res,'Login successfulli', result, 201)
        }catch(error){
            logger.error(`[Error/auth/controller/login]: ${error}`)
            return ResponseHelper.error(res, 'Error ocurred', null,500)
        }
    }
}
