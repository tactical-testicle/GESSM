import { CatFolioDAO } from '../daos/catFolio.dao';
import  ICatFolio  from '../interfaces/catFolio.interface';
import logger from '../../lib/logger';

export class CatFolioService {
  static async createCatFolio(body: ICatFolio) {
    try {
      const newFolio = await CatFolioDAO.create(body);
      return {
        ok: true,
        message: 'Folio creado correctamente',
        response: newFolio,
        code: 201,
      };
    } catch (err) {
      logger.error(`[service/catFolio/create]: ${err}`);
      return {
        ok: false,
        message: 'Error al crear el folio',
        code: 500,
      };
    }
  }

  static async getCatFolios() {
    try {
      const folios = await CatFolioDAO.findAll();
      return {
        ok: true,
        message: 'Folios obtenidos correctamente',
        response: folios,
        code: 200,
      };
    } catch (err) {
      logger.error(`[service/catFolio/getAll]: ${err}`);
      return {
        ok: false,
        message: 'Error al obtener folios',
        code: 500,
      };
    }
  }

  static async getCatFolio(id: number) {
    try {
      const folio = await CatFolioDAO.findById(id);
      if (!folio) {
        return {
          ok: false,
          message: 'Folio no encontrado',
          code: 404,
        };
      }
      return {
        ok: true,
        message: 'Folio encontrado',
        response: folio,
        code: 200,
      };
    } catch (err) {
      logger.error(`[service/catFolio/getById]: ${err}`);
      return {
        ok: false,
        message: 'Error al buscar folio',
        code: 500,
      };
    }
  }
}