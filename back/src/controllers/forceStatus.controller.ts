import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { ForceStatusService } from "../services/forceStatus.service";
import JWTUtil from "../utils/jwt.util";
import { UserService } from "../services/user.service";

export default class forceStatusController {

    async createForceStatusRecord(req: Request, res: Response): Promise<any> {
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

            const response = await ForceStatusService.createForceStatus(req.body);

            if (!response) {
                return ResponseHelper.error(res, 'Could not create forceStatusRecord', null, 400);
            }

            return ResponseHelper.success(res, 'forceStatusRecord created successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/forceStatusRecord]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getListEstado(req: Request, res: Response): Promise<any> {
        try {
            const response = await ForceStatusService.getlistEstado();
            return ResponseHelper.success(res, 'Fetched Incidencias successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/getforceStatuss]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCountEstadoByDay(req: Request, res: Response): Promise<any> {
        try {
            const { fecha } = req.body;
            const response = await ForceStatusService.getCountEstadoByDay(fecha);
            return ResponseHelper.success(res, 'Fetched totalEstado successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/gettotalEstado]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getListEstadoByDay(req: Request, res: Response): Promise<any> {
        try {
            const { fecha } = req.body;
            const response = await ForceStatusService.getListEstadoByDay(fecha);
            return ResponseHelper.success(res, 'Fetched totalEstado successfully', response, 200);
        } catch (error) {
            logger.error(`[Error/controller/gettotalEstado]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
//falta implementar
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
            const infoIncidencia = await ForceStatusService.getById(_id) as any;

            infoIncidencia.status = infoIncidencia.status === 'inactive' ? 'active' : 'inactive';
            infoIncidencia.fechaActualizacion = new Date();
            infoIncidencia.usuarioActualizacion = infoUser.data?.ficha;

            const updated = await ForceStatusService.updateIncidencia(infoIncidencia);

            return ResponseHelper.success(res, 'Incidencia updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteforceStatus]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}