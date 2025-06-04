import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatFolioService } from "../services/catFolio.service";

export default class CatFolioController {

  async createCatFolio(req: Request, res: Response): Promise<any> {
    try {
      const body = req.body;
      if (!body) {
        return ResponseHelper.error(res, 'No data received', null, 400);
      }

      const response = await CatFolioService.createCatFolio(body);

      if (!response) {
        return ResponseHelper.error(res, 'Could not create catFolio', null, 400);
      }

      return ResponseHelper.success(res, 'CatFolio created successfully', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolio/create]: ${error}`);
      return ResponseHelper.error(res, 'Internal Server Error', null, 500);
    }
  }

  async getCatFolios(req: Request, res: Response): Promise<any> {
    try {
      const response = await CatFolioService.getCatFolios();

      if (!response || response.response?.length === 0) {
        return ResponseHelper.error(res, 'No CatFolios found', [], 404);
      }

      return ResponseHelper.success(res, 'Fetched CatFolios successfully', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolio/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Internal Server Error', null, 500);
    }
  }

  static async getCatFolioById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      if (!id) {
        return ResponseHelper.error(res, 'Missing ID parameter', null, 400);
      }

      const response = await CatFolioService.getCatFolio(Number(id));

      if (!response) {
        return ResponseHelper.error(res, 'CatFolio not found', null, 404);
      }

      return ResponseHelper.success(res, 'Fetched CatFolio successfully', response, 200);
    } catch (error) {
      logger.error(`[controller/catFolio/getById]: ${error}`);
      return ResponseHelper.error(res, 'Internal Server Error', null, 500);
    }
  }
}