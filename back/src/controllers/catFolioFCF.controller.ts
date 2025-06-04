import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatFolioFCFService } from "../services/catFolioFCF.service";
import { UserService } from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatFolioFCFController {
  async createCatFolioFCF(req: Request, res: Response): Promise<any> {
    try {
      const { cantidadFCF, inicioFCF } = req.body;
      const token = req.headers.authorization;
      if (!cantidadFCF || !inicioFCF || !token) {
        return ResponseHelper.error(res, 'Datos incompletos', null, 400);
      }

      const user = await new JWTUtil().decodeToken(token) as any;
      const infoUser = await UserService.getUserById(user.id);
      let response = null;

      for (let i = 0; i < cantidadFCF; i++) {
        const body = {
          ...req.body,
          folioFCF: Number(inicioFCF) + i,
          usuarioCreacion: infoUser.data?.ficha?.toString(),
        };
        response = await CatFolioFCFService.createCatFolioFCF(body);
      }

      return ResponseHelper.success(res, 'FolioFCFs creados correctamente', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolioFCF/create]: ${error}`);
      return ResponseHelper.error(res, 'Error interno al crear', error, 500);
    }
  }

  async getExisteCatFolioFCFs(_: Request, res: Response): Promise<any> {
    try {
      const response = await CatFolioFCFService.existeCatFolioFCFActivo();
      return ResponseHelper.success(res, 'Resultado obtenido', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolioFCF/existe]: ${error}`);
      return ResponseHelper.error(res, 'Error interno', error, 500);
    }
  }

  async getCatFolioFCFs(_: Request, res: Response): Promise<any> {
    try {
      const response = await CatFolioFCFService.getCatFolioFCFs();
      return ResponseHelper.success(res, 'Lista obtenida', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolioFCF/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error interno', error, 500);
    }
  }

  async folioFCFDisponible(_: Request, res: Response): Promise<any> {
    try {
      const response = await CatFolioFCFService.folioFCFDisponible();
      return ResponseHelper.success(res, 'Folio disponible obtenido', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolioFCF/disponible]: ${error}`);
      return ResponseHelper.error(res, 'Error interno', error, 500);
    }
  }

  async take(req: Request, res: Response): Promise<any> {
    try {
      const { id, nomfolio } = req.body;
      const token = req.headers.authorization;

      if (!id || !nomfolio || !token) {
        return ResponseHelper.error(res, 'Datos incompletos', null, 400);
      }

      const user = await new JWTUtil().decodeToken(token) as any;
      const infoUser = await UserService.getUserById(user.id);
      const { data:infoFolioFCF } = await CatFolioFCFService.getCatFolioFCF(id);

      if (!infoFolioFCF) {
        return ResponseHelper.error(res, 'No se encontró el folio FCF', null, 404);
      }
      infoFolioFCF.estatus = false;
      infoFolioFCF.assignedFolio = nomfolio;
      infoFolioFCF.fechaModificacion = new Date();
      infoFolioFCF.usuarioModificacion = infoUser.data?.ficha?.toString();

      const response = await CatFolioFCFService.updateCatFolioFCF(infoFolioFCF);
      return ResponseHelper.success(res, 'Folio FCF tomado correctamente', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolioFCF/take]: ${error}`);
      return ResponseHelper.error(res, 'Error al tomar folio FCF', error, 500);
    }
  }
}