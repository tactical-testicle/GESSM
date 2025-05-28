import { CatRemitenteDAO } from '../daos/catRemitente.dao';
import ICatRemitente from '../interfaces/catRemitente.interface';
import logger from '../../lib/logger';

export class CatRemitenteService {
  /** Crea un nuevo remitente */
  static async createCatRemitente(body: ICatRemitente) {
    try {
      const exists = await CatRemitenteDAO.findAll()
        .then(list => list.find(r => r.nombre === body.nombre));
      if (exists) {
        return {
          ok: false,
          message: `El remitente '${body.nombre}' ya existe.`,
          code: 409
        };
      }
      const newR = await CatRemitenteDAO.create(body);
      return {
        ok: true,
        message: 'Remitente creado correctamente',
        response: newR,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catRemitente/create]: ${error}`);
      return { ok: false, message: 'Error interno al crear remitente', code: 500 };
    }
  }

  /** Obtiene todos los remitentes */
  static async getCatRemitentes() {
    try {
      const list = await CatRemitenteDAO.findAll();
      return {
        ok: true,
        message: 'Remitentes obtenidos',
        response: list,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catRemitente/getAll]: ${error}`);
      return { ok: false, message: 'Error al obtener remitentes', code: 500 };
    }
  }

  /** Obtiene un remitente por ID */
  static async getCatRemitente(id: string) {
    try {
      const r = await CatRemitenteDAO.findById(id);
      if (!r) {
        return { ok: false, message: 'Remitente no encontrado', code: 404 };
      }
      return { ok: true, message: 'Remitente encontrado', response: r, code: 200 };
    } catch (error) {
      logger.error(`[service/catRemitente/getById]: ${error}`);
      return { ok: false, message: 'Error al buscar remitente', code: 500 };
    }
  }

  /** Actualiza (o activa/desactiva) un remitente existente */
  static async updateCatRemitente(body: ICatRemitente) {
    try {
      const updated = await CatRemitenteDAO.update(body);
      return {
        ok: true,
        message: 'Remitente actualizado',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catRemitente/update]: ${error}`);
      return { ok: false, message: 'Error al actualizar remitente', code: 500 };
    }
  }

  /** Para uso en bulk-upload: getOrCreateByName */
  static async getOrCreateByName(nombre: string): Promise<number> {
    try {
      return await CatRemitenteDAO.getOrCreateByName(nombre);
    } catch (error) {
      logger.error(`[service/catRemitente/getOrCreateByName]: ${error}`);
      throw error;
    }
  }
}