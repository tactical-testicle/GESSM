import { UserDAO } from '../daos/user.dao';
import  IUser  from '../interfaces/user.interface';
import logger from '../../lib/logger';

export class UserService {
  static async createUser(body: IUser) {
    try {
      const exists = await UserDAO.findByFicha(body.ficha);
      if (exists) {
        return {
          ok: false,
          message: `El usuario con ficha ${body.ficha} ya está registrado.`,
          code: 409
        };
      }

      const newUser = await UserDAO.create(body);

      return {
        ok: true,
        message: 'Usuario creado exitosamente.',
        data: newUser,
        code: 201
      };
    } catch (error) {
      logger.error(`[Error/UserService/createUser]: ${error}`);
      return {
        ok: false,
        message: 'Error al crear el usuario.',
        code: 500
      };
    }
  }

  static async getUsers() {
    try {
      const users = await UserDAO.findAll();
      return {
        ok: true,
        data: users,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/getUsers]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener los usuarios.',
        code: 500
      };
    }
  }

  static async getUserByFicha(ficha: number) {
    try {
      const user = await UserDAO.findByFicha(ficha);
      logger.info("user: ", user)
      if (!user) {
        return {
          ok: false,
          message: `No se encontró el usuario con ficha ${ficha}.`,
          code: 404
        };
      }

      return {
        ok: true,
        data: user,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/getUserByFicha]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener el usuario.',
        code: 500
      };
    }
  }

  static async updateUser(body: IUser) {
    try {
      const updatedUser = await UserDAO.update(body);

      return {
        ok: true,
        message: 'Usuario actualizado correctamente.',
        data: updatedUser,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/updateUser]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar el usuario.',
        code: 500
      };
    }
  }

  static async deleteUser(id: number) {
    try {
      await UserDAO.delete(id);
      return {
        ok: true,
        message: 'Usuario eliminado correctamente.',
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/deleteUser]: ${error}`);
      return {
        ok: false,
        message: 'Error al eliminar el usuario.',
        code: 500
      };
    }
  }
  async getUserById(id: number) {
    try {
      const user = await UserDAO.findById(id);
      if (!user) {
        return {
          ok: false,
          message: `No se encontró el usuario con ID ${id}.`,
          code: 404
        };
      }
  
      return {
        ok: true,
        data: user,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/getUserById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener el usuario por ID.',
        code: 500
      };
    }
  }

  static async getUserById(id: number) {
    try {
      const user = await UserDAO.findById(id);
      if (!user) {
        return {
          ok: false,
          message: `No se encontró el usuario con ID ${id}.`,
          code: 404
        };
      }
  
      return {
        ok: true,
        data: user,
        code: 200
      };
    } catch (error) {
      logger.error(`[Error/UserService/getUserById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener el usuario por ID.',
        code: 500
      };
    }
  }


  static async getAdminUsers() {
    try {
      const users = await UserDAO.findAdmins();

      return {
        ok: true,
        data: users,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/user/getAdminUsers]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener usuarios administrativos',
        code: 500
      };
    }
  }

}