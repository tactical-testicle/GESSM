import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatRemitenteService } from "../services/catRemitente.service";
import JWTUtil from "../utils/jwt.util";
import { UserService } from "../services/user.service";

export default class CatRemitenteController {
  /**  
   * POST /catRemitente
   * Crea un nuevo remitente
   */
  async createCatRemitente(req: Request, res: Response): Promise<any> {
    try {
      if (!req.body) {
        return ResponseHelper.error(res, "No data received", null, 400);
      }
      const result = await CatRemitenteService.createCatRemitente(req.body);
      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }
      return ResponseHelper.success(res, result.message, result.response, result.code);
    } catch (error) {
      logger.error(`[controller/catRemitente/create]: ${error}`);
      return ResponseHelper.error(res, "Internal Server Error", null, 500);
    }
  }

  /**
   * GET /catRemitente
   * Devuelve todos los remitentes
   */
  async getCatRemitentes(_req: Request, res: Response): Promise<any> {
    try {
      const result = await CatRemitenteService.getCatRemitentes();
      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }
      return ResponseHelper.success(res, result.message, result.response, result.code);
    } catch (error) {
      logger.error(`[controller/catRemitente/getAll]: ${error}`);
      return ResponseHelper.error(res, "Internal Server Error", null, 500);
    }
  }

  /**
   * POST /catRemitente/delete
   * Borrado lógico: alterna status active/inactive
   * Recibe { id } en body y token en headers.authorization
   */
  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body;
      const token = req.headers.authorization;
      if (!id || !token) {
        return ResponseHelper.error(res, "ID or token missing", null, 400);
      }

      const jwtUtil = new JWTUtil();
      const userService = new UserService();
      const decoded = await jwtUtil.decodeToken(token) as any;
      const infoUser = await userService.getUserById(decoded.id);

      const fetchResult = await CatRemitenteService.getCatRemitente(id);
      if (!fetchResult.ok) {
        return ResponseHelper.error(res, fetchResult.message, null, fetchResult.code);
      }

      // alternar status
      const remitente = fetchResult.response as any;
      remitente.status = remitente.status === "inactive" ? "active" : "inactive";
      remitente.fechaActualizacion = new Date();
      // asegurar string
      remitente.usuarioActualizacion = infoUser.data?.ficha.toString();

      const updateResult = await CatRemitenteService.updateCatRemitente(remitente);
      if (!updateResult.ok) {
        return ResponseHelper.error(res, updateResult.message, null, updateResult.code);
      }
      return ResponseHelper.success(res, updateResult.message, updateResult.response, updateResult.code);

    } catch (error) {
      logger.error(`[controller/catRemitente/delete]: ${error}`);
      return ResponseHelper.error(res, "Internal Server Error", null, 500);
    }
  }
}