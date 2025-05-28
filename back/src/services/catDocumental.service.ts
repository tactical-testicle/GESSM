import { CatDocumentalDAO } from '../daos/catDocumental.dao';
import  ICatDocumental  from '../interfaces/catDocumental.interface';
import logger from '../../lib/logger';

export class CatDocumentalService {
  /** Crea una nueva serie documental */
  static async createCatDocumental(body: ICatDocumental) {
    try {
      // Verificar duplicados por nombre
      const exists = await CatDocumentalDAO.findAll()
        .then(list => list.find(d => d.name === body.name));
      if (exists) {
        return {
          ok: false,
          message: `La serie documental '${body.name}' ya está registrada.`,
          code: 409
        };
      }
      const newDoc = await CatDocumentalDAO.create(body);
      return {
        ok: true,
        message: 'Serie documental creada correctamente',
        response: newDoc,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catDocumental/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear serie documental',
        code: 500
      };
    }
  }

  /** Obtiene todas las series documentales */
  static async getCatDocumentals() {
    try {
      const list = await CatDocumentalDAO.findAll();
      return {
        ok: true,
        message: 'Series documentales obtenidas',
        response: list,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDocumental/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener series documentales',
        code: 500
      };
    }
  }

  /** Obtiene una serie documental por ID */
  static async getCatDocumental(id: string) {
    try {
      const doc = await CatDocumentalDAO.findById(id);
      if (!doc) {
        return { ok: false, message: 'Serie documental no encontrada', code: 404 };
      }
      return { ok: true, message: 'Serie documental encontrada', response: doc, code: 200 };
    } catch (error) {
      logger.error(`[service/catDocumental/getById]: ${error}`);
      return { ok: false, message: 'Error al buscar serie documental', code: 500 };
    }
  }

  /** Actualiza una serie documental existente */
  static async updateCatDocumental(body: ICatDocumental) {
    try {
      const updated = await CatDocumentalDAO.update(body);
      return {
        ok: true,
        message: 'Serie documental actualizada',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDocumental/update]: ${error}`);
      return { ok: false, message: 'Error al actualizar serie documental', code: 500 };
    }
  }

  /** Para uso en carga masiva: getOrCreateByName */
  static async getOrCreateByName(nombre: string): Promise<number> {
    try {
      return await CatDocumentalDAO.getOrCreateByName(nombre);
    } catch (error) {
      logger.error(`[service/catDocumental/getOrCreateByName]: ${error}`);
      throw error;
    }
  }
}