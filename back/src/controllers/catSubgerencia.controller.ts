import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { catSubgerenciaService } from "../services/catSubgerencia.service";
import { UserService } from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class catSubgerenciaController {

  static async createcatSubgerencia(req: Request, res: Response): Promise<any> {
    try {
      if (!req.body) {
        return ResponseHelper.error(res, 'No data received', null, 400);
      }

      const response = await catSubgerenciaService.createCatSubgerencia(req.body);
      return ResponseHelper.success(res, 'Gerencia creada correctamente', response.response, response.code);
    } catch (error) {
      logger.error(`[controller/catSubgerencia/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al crear gerencia', null, 500);
    }
  }

  static async getCatSubgerencias(req: Request, res: Response): Promise<any> {
    try {
      const response = await catSubgerenciaService.getCatSubgerencias();
      return ResponseHelper.success(res, 'Gerencias obtenidas correctamente', response.response, response.code);
    } catch (error) {
      logger.error(`[controller/catSubgerencia/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener gerencias', null, 500);
    }
  }

  static async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body;
      const token = req.headers.authorization;

      if (!token || !id) {
        return ResponseHelper.error(res, 'Token o ID faltante', null, 400);
      }

      const jwtUtil = new JWTUtil();
      const userService = new UserService();
      const decoded = await jwtUtil.decodeToken(token) as any;

      const infoUser = await userService.getUserById(decoded.id);
      const gerenciaResult = await catSubgerenciaService.getCatSubgerencia(id);

      if (!gerenciaResult.ok || !gerenciaResult.response) {
        return ResponseHelper.error(res, 'Gerencia no encontrada', null, 404);
      }

      const gerencia = gerenciaResult.response;
      gerencia.estatus = gerencia.estatus === false ? true : false;
      gerencia.fechaModificacion = new Date();
      gerencia.usuarioModificacion = infoUser.data?.ficha.toString(); // Asegura string

      const updateResult = await catSubgerenciaService.update(gerencia);

      return ResponseHelper.success(res, 'Gerencia actualizada', updateResult.response, updateResult.code);
    } catch (error) {
      logger.error(`[controller/catSubgerencia/delete]: ${error}`);
      return ResponseHelper.error(res, 'Error al eliminar gerencia', null, 500);
    }
  }
}