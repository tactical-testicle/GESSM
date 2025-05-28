import { Request, Response } from 'express';
import logger from '../../lib/logger';
import { ResponseHelper } from '../helpers/response.helper';
import { FolioService } from '../services/folio.service';
import fileUpload from 'express-fileupload';

export default class CargaMasivaController {

  static async createCargaMasiva(req: Request, res: Response): Promise<any> {
    try {
      if (!req.files || !req.files.file) {
        return ResponseHelper.error(res, 'No se ha cargado ningún archivo.', null, 400);
      }

      const file = req.files.file as fileUpload.UploadedFile;
      logger.info(`Archivo recibido para carga masiva: ${file.name}`);

      const result = await FolioService.bulkUploadFromCSV(file);
      return ResponseHelper.success(res, 'Carga masiva completada con éxito.', result, 201);

    } catch (error) {
      logger.error(`[controller/cargaMasiva/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al procesar carga masiva.', null, 500);
    }
  }
}