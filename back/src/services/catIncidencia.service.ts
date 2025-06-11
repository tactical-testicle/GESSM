import { CatIncidenciaDAO } from '../daos/catIncidencia.dao';
import ICatIncidencia from '../interfaces/catIncidencia.interface';
import logger from '../../lib/logger';

export class CatIncidenciaService {
  static async createCatIncidencia(body: ICatIncidencia) {
    try {
      const exists = await CatIncidenciaDAO.findByName(body.nombre);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El ${body.nombre} ya está registrado.`,
          code: 409
        };
      }
console.log("pasoo: ", body)
      const newIncidencia = await CatIncidenciaDAO.create(body);
      return {
        ok: true,
        message: 'Creado correctamente',
        response: newIncidencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catIncidencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatIncidencias() {
    try {
      const Incidencias = await CatIncidenciaDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: Incidencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catIncidencia/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener Incidencias',
        code: 500
      };
    }
  }

   static async getTotalEstado(fecha: Date) {
    try {
      const totalEstado = await CatIncidenciaDAO.totalEstado(fecha);
      return {
        ok: true,
        message: 'Lista obtenida',
        response: totalEstado,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/totalEstado/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener totalEstado',
        code: 500
      };
    }
  }

  static async updateIncidencia(Incidencia: ICatIncidencia) {
    try {
      const updated = await CatIncidenciaDAO.update(Incidencia);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catIncidencia/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
        code: 500
      };
    }
  }

  static async getCatIncidencia(id: string) {
    try {
      const Incidencia = await CatIncidenciaDAO.findById(id);
      return {
        ok: true,
        message: 'Incidencia encontrado',
        response: Incidencia,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catIncidencia/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el Incidencia',
        code: 500
      };
    }
  }
}