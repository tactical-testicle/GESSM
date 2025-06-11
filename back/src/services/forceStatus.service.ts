import { ForceStatusDAO } from '../daos/forceStatus.dao';
import IForceStatus from '../interfaces/forceStatus.interface';
import logger from '../../lib/logger';

export class ForceStatusService {
  static async createForceStatus(body: IForceStatus) {
    try {
      const exists = await ForceStatusDAO.findByFichaDay(body.usuarioId, body.fecha);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El usuario ya está registrado en ese día.`,
          code: 409
        };
      }
      const newIncidencia = await ForceStatusDAO.create(body);
      return {
        ok: true,
        message: 'Registro creado correctamente',
        response: newIncidencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/ForceStatus/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getlistEstado() {
    try {
      const forceStatus = await ForceStatusDAO.listEstado();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: forceStatus,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/ForceStatus/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener lista.',
        code: 500
      };
    }
  }

  static async getCountEstadoByDay(fecha: Date) {
    try {
      const totalEstado = await ForceStatusDAO.countEstadoByDay(fecha);
      return {
        ok: true,
        message: 'Conteo obtenido',
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

  //falta
  static async updateIncidencia(Incidencia: IForceStatus) {
    try {
      const updated = await ForceStatusDAO.update(Incidencia);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/ForceStatus/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
        code: 500
      };
    }
  }

  static async getListEstadoByDay(fecha: Date) {
    try {
      const List = await ForceStatusDAO.listEstadoByDay(fecha);
      return {
        ok: true,
        message: 'Lista del estado de furza por día encontrado',
        response: List,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/ForceStatus/ListEstadoByDay]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el estado de furza por día',
        code: 500
      };
    }
  }

  static async getById(id: number) {
    try {
      const user = await ForceStatusDAO.findById(id);
      if (!user) {
        return {
          ok: false,
          message: `No se encontró el registro con ID ${id}.`,
          code: 404
        };
      }
      return {
        ok: true,
        data: user,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener el registro por ID.',
        code: 500
      };
    }
  }
}