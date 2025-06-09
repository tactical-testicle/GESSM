import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatSuperintendenciaService } from "../services/catSuperintendencia.service";
import { UserService } from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatSuperintendenciaController {

  async createCatSuperintendencia(req: Request, res: Response): Promise<any> {
    try {
      if (!req.body) {
        return ResponseHelper.error(res, 'No data received', null, 400);
      }
      console.log("Sacar el nombre de quien la va a crear: ")
      const token = req.headers.authorization;
      const jwt = new JWTUtil();
      const decoded = await jwt.decodeToken(token as string) as any;
      req.body.usuarioCreacion = decoded.user.ficha
      console.log("Lo va a crear: ", req.body.usuarioCreacion)
      
      const response = await CatSuperintendenciaService.createCatSuperintendencia(req.body);
      return ResponseHelper.success(res, 'Superintendencia creada correctamente', response.response, response.code);
    } catch (error) {
      logger.error(`[controller/catSuperintendencia/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al crear gerencia', null, 500);
    }
  }

  async getCatSuperintendencias(req: Request, res: Response): Promise<any> {
    try {
      const response = await CatSuperintendenciaService.getCatSuperintendencias();
      return ResponseHelper.success(res, 'Superintendencia obtenidas correctamente', response.response, response.code);
    } catch (error) {
      logger.error(`[controller/catSuperintendencia/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener Superintendencia', null, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
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
      const gerenciaResult = await CatSuperintendenciaService.getCatSuperintendencia(id);

      if (!gerenciaResult.ok || !gerenciaResult.response) {
        return ResponseHelper.error(res, 'Superintendencia no encontrada', null, 404);
      }

      const gerencia = gerenciaResult.response;
      gerencia.estatus = gerencia.estatus === false ? true : false;
      gerencia.fechaModificacion = new Date();
      gerencia.usuarioModificacion = infoUser.data?.ficha.toString(); // Asegura string

      const updateResult = await CatSuperintendenciaService.update(gerencia);

      return ResponseHelper.success(res, 'Superintendencia actualizada', updateResult.response, updateResult.code);
    } catch (error) {
      logger.error(`[controller/catSuperintendencia/delete]: ${error}`);
      return ResponseHelper.error(res, 'Error al eliminar gerencia', null, 500);
    }
  }
}