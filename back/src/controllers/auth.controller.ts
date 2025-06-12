import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { AuthService } from "../services/auth.service";
import JWTUtil from "../utils/jwt.util";

export default class AuthController {
    async register(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body) {
                return ResponseHelper.error(res, 'Please provide user data', null, 400);
            }

            const user = await AuthService.register(req.body);

            if (!user?.ok) {
                return ResponseHelper.error(res, user.message, user?.createdUser, user?.code);
            }

            return ResponseHelper.success(res, 'User created successfully', user, 201);
        } catch (error) {
            logger.error(`[Error/controller/register]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { ficha, password } = req.body
            const result = await AuthService.login(ficha, password)
            return ResponseHelper.success(res, 'Login successfulli', result, 201)
        } catch (error) {
            logger.error(`[Error/auth/controller/login]: ${error}`)
            return ResponseHelper.error(res, 'Error ocurred', null, 500)
        }
    }

    async auth(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.authorization;
            if(!token){
                console.log("No se recibio token.")
                return ResponseHelper.error(res, 'No se recibio token.', null, 500)
            }
            const jwt = new JWTUtil();
            const decoded = await jwt.decodeToken(token as string) as any;
            const result = await AuthService.LoginRefresh(decoded.user)            
            return ResponseHelper.success(res, 'Auth refresh successfulli', result.token, 201)
        } catch (error) {
            logger.error(`[Error/auth/controller/login]: ${error}`)
            return ResponseHelper.error(res, 'Error ocurred', null, 500)
        }
    }

}
