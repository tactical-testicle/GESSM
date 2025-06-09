import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatPuestoService } from "../services/catPuesto.service";
import JWTUtil from "../utils/jwt.util";
import { UserService } from "../services/user.service";

export default class CatPuestoController {

    async createCatPuesto(req: Request, res: Response): Promise<any> {
        try {
            console.log("body enviado: ", req.body)
            if (!req.body) {
                return ResponseHelper.error(res, 'No data received', null, 400);
            }
            console.log("Sacar el nombre de quien la va a crear: ")
            const token = req.headers.authorization;
            const jwt = new JWTUtil();
            const decoded = await jwt.decodeToken(token as string) as any;
            req.body.usuarioCreacion = decoded.user.ficha
            console.log("Lo va a crear: ", req.body.usuarioCreacion)

            const response = await CatPuestoService.createCatPuesto(req.body);

            if (!response) {
                return ResponseHelper.error(res, 'Could not create puesto', null, 400);
            }

            return ResponseHelper.success(res, 'Puesto created successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/createCatPuesto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCatPuestos(req: Request, res: Response): Promise<any> {
        try {
            const response = await CatPuestoService.getCatPuestos();
            return ResponseHelper.success(res, 'Fetched puestos successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/getCatPuestos]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { _id } = req.body;
            const token = req.headers.authorization;

            if (!_id || !token) {
                return ResponseHelper.error(res, 'Missing ID or token', null, 400);
            }

            const jwtUtil = new JWTUtil();
            const userService = new UserService();

            const user = await jwtUtil.decodeToken(token) as any;
            const infoUser = await userService.getUserById(user.id);
            const infoPuesto = await CatPuestoService.getCatPuesto(_id) as any;

            infoPuesto.status = infoPuesto.status === 'inactive' ? 'active' : 'inactive';
            infoPuesto.fechaActualizacion = new Date();
            infoPuesto.usuarioActualizacion = infoUser.data?.ficha;

            const updated = await CatPuestoService.updatePuesto(infoPuesto);

            return ResponseHelper.success(res, 'Puesto updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteCatPuesto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}