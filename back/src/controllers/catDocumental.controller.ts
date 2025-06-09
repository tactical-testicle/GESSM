import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatDocumentalService } from "../services/catDocumental.service";
import JWTUtil from "../utils/jwt.util";
import { UserService } from "../services/user.service";

export default class CatDocumentalController {
  async createCatDocumental(req: Request, res: Response): Promise<any> {
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

      const result = await CatDocumentalService.createCatDocumental(req.body);

      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }

      return ResponseHelper.success(res, 'Documental creado correctamente', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/createCatDocumental]: ${error}`);
      return ResponseHelper.error(res, 'Error interno al crear Documental', null, 500);
    }
  }

  async getCatDocumentals(req: Request, res: Response): Promise<any> {
    try {
      const result = await CatDocumentalService.getCatDocumentals();
      return ResponseHelper.success(res, 'Lista obtenida con éxito', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/getCatDocumentals]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener Documentals', null, 500);
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { _id } = req.body;
      const token = req.headers.authorization;

      if (!_id || !token) {
        return ResponseHelper.error(res, 'Faltan parámetros necesarios (_id o token)', null, 400);
      }

      const result = await CatDocumentalService.delete(_id, token);

      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }

      return ResponseHelper.success(res, 'Estado del Documental actualizado', result, 200);
    } catch (error) {
      logger.error(`[Error/controller/deleteCatDocumental]: ${error}`);
      return ResponseHelper.error(res, 'Error al eliminar Documental', null, 500);
    }
  }
}