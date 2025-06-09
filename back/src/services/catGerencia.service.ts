import { CatGerenciaDAO } from '../daos/catGerencia.dao';
import ICatGerencia from '../interfaces/catGerencia.interface';
import logger from '../../lib/logger';

export class CatGerenciaService {
  static async createCatGerencia(body: ICatGerencia) {
    try {
      
      const newGerencia = await CatGerenciaDAO.create(body);
      return {
        ok: true,
        message: 'Gerencia creada exitosamente',
        response: newGerencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catGerencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear la gerencia',
        code: 500
      };
    }
  }

  static async update(body: ICatGerencia) {
    try {
      const updatedGerencia = await CatGerenciaDAO.update(body);
      return {
        ok: true,
        message: 'Gerencia actualizada correctamente',
        response: updatedGerencia,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catGerencia/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar la gerencia',
        code: 500
      };
    }
  }

  static async getCatGerencias() {
    try {
      console.log("2")
      const gerencias = await CatGerenciaDAO.findAll();
      return {
        ok: true,
        message: 'Gerencias obtenidas',
        response: gerencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catGerencia/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener gerencias',
        code: 500
      };
    }
  }

  static async getCatGerencia(id: string) {
    try {
      const gerencia = await CatGerenciaDAO.findById(id);
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
      logger.error(`[service/catGerencia/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener la gerencia',
        code: 500
      };
    }
  }
}