import { CatSuperintendenciaDAO } from '../daos/catSuperintendencia.dao';
import IcatSuperintendencia from '../interfaces/catSuperintendencia.interface';
import logger from '../../lib/logger';

export class CatSuperintendenciaService {
  static async createCatSuperintendencia(body: IcatSuperintendencia) {
    try {
      const newGerencia = await CatSuperintendenciaDAO.create(body);
      return {
        ok: true,
        message: 'Gerencia creada exitosamente',
        response: newGerencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear la gerencia',
        code: 500
      };
    }
  }

  static async update(body: IcatSuperintendencia) {
    try {
      const updatedGerencia = await CatSuperintendenciaDAO.update(body);
      return {
        ok: true,
        message: 'Gerencia actualizada correctamente',
        response: updatedGerencia,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar la gerencia',
        code: 500
      };
    }
  }

  static async getCatSuperintendencias() {
    try {
      const gerencias = await CatSuperintendenciaDAO.findAll();
      return {
        ok: true,
        message: 'Gerencias obtenidas',
        response: gerencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener gerencias',
        code: 500
      };
    }
  }

  static async getCatSuperintendencia(id: string) {
    try {
      const gerencia = await CatSuperintendenciaDAO.findById(id);
      if (!gerencia) {
        return {
          ok: false,
          message: 'Gerencia no encontrada',
          code: 404
        };
      }

      return {
        ok: true,
        message: 'Gerencia encontrada',
        response: gerencia,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener la gerencia',
        code: 500
      };
    }
  }
}