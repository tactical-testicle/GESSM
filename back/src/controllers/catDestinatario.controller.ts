import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatDestinatarioService } from "../services/catDestinatario.service";
import JWTUtil from "../utils/jwt.util";
import { UserService } from "../services/user.service";

export default class CatDestinatarioController {
  async createCatDestinatario(req: Request, res: Response): Promise<any> {
    try {
      if (!req.body) {
        return ResponseHelper.error(res, 'No se recibió información', null, 400);
      }
      console.log("Sacar el nombre de quien la va a crear: ")
      const token = req.headers.authorization;
      const jwt = new JWTUtil();
      const decoded = await jwt.decodeToken(token as string) as any;
      req.body.usuarioCreacion = decoded.user.ficha
      console.log("Lo va a crear: ", req.body.usuarioCreacion)
      
      const result = await CatDestinatarioService.createCatDestinatario(req.body);

      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }

      return ResponseHelper.success(res, 'Destinatario creado correctamente', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/createCatDestinatario]: ${error}`);
      return ResponseHelper.error(res, 'Error interno al crear destinatario', null, 500);
    }
  }

  async getCatDestinatarios(req: Request, res: Response): Promise<any> {
    try {
      const result = await CatDestinatarioService.getCatDestinatarios();
      return ResponseHelper.success(res, 'Lista obtenida con éxito', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/getCatDestinatarios]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener destinatarios', null, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { _id } = req.body;
      const token = req.headers.authorization;

      if (!_id || !token) {
        return ResponseHelper.error(res, 'Faltan parámetros necesarios (_id o token)', null, 400);
      }

      const result = await CatDestinatarioService.delete(_id, token);

      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }

      return ResponseHelper.success(res, 'Estado del destinatario actualizado', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/deleteCatDestinatario]: ${error}`);
      return ResponseHelper.error(res, 'Error al eliminar destinatario', null, 500);
    }
  }
}