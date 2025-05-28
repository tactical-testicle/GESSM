import { CatDestinatarioDAO } from '../daos/catDestinatario.dao';
import  ICatDestinatario  from '../interfaces/catDestinatario.interface';
import logger from '../../lib/logger';

export class CatDestinatarioService {
  static async createCatDestinatario(body: ICatDestinatario) {
    try {
      const exists = await CatDestinatarioDAO.findByNombre(body.nombre);
      if (exists) {
        return {
          ok: false,
          message: `El destinatario '${body.nombre}' ya existe.`,
          code: 409
        };
      }

      const newDestinatario = await CatDestinatarioDAO.create(body);
      return {
        ok: true,
        message: 'Destinatario creado correctamente',
        response: newDestinatario,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catDestinatario/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear el destinatario',
        code: 500
      };
    }
  }

  static async getCatDestinatarios() {
    try {
      const data = await CatDestinatarioDAO.findAll();
      return {
        ok: true,
        message: 'Consulta exitosa',
        response: data,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDestinatario/getCatDestinatarios]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener destinatarios',
        code: 500
      };
    }
  }

  static async delete(id: string, ficha: string) {
    try {
      const destinatario = await CatDestinatarioDAO.findById(id);
      if (!destinatario) {
        return {
          ok: false,
          message: 'Destinatario no encontrado',
          code: 404
        };
      }

      const newStatus = !destinatario.estatus;
      const updated = await CatDestinatarioDAO.updateStatus(id, newStatus);
      return {
        ok: true,
        message: `Destinatario ${newStatus ? 'activado' : 'desactivado'} correctamente`,
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDestinatario/delete]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar destinatario',
        code: 500
      };
    }
  }
}