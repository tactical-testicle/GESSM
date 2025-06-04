import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import Encription from "../utils/encryption.util";
import JWTUtil from "../utils/jwt.util";
import { ResponseHelper } from "../helpers/response.helper";
import logger from "../../lib/logger";

export default class UserController {
   async createUser(req: Request, res: Response): Promise<any> {
    try {
      const body = req.body;
      if (!body) {
        return ResponseHelper.error(res, "No data received", null, 400);
      }

      const exist = await UserService.getUserByFicha(body.ficha);
      if (exist.ok) {
        return ResponseHelper.error(res, "La ficha que intentas crear, ya existe", null, 409);
      }
      const encription = new Encription();
      const { iv, encryptedData } = await encription.encryptPassword(body.password);
      body.salt = iv;
      body.password = encryptedData;
      const response = await UserService.createUser(body);
      console.log("response: ",response)
if(response.ok)
      return ResponseHelper.success(res, "Usuario creado exitosamente", response, 201);
else
      return ResponseHelper.success(res, "Usuario no creado exitosamente", response, 400);

    } catch (error) {
      logger.error(`[controller/user/createUser]: ${error}`);
      return ResponseHelper.error(res, "Error al crear usuario", null, 500);
    }
  }

   async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const body = req.body;
      body.fechaActualizacion = new Date();

      const response = await UserService.updateUser(body);
      return ResponseHelper.success(res, "Usuario actualizado", response, 200);
    } catch (error) {
      logger.error(`[controller/user/updateUser]: ${error}`);
      return ResponseHelper.error(res, "Error al actualizar", null, 500);
    }
  }

   async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body;
      const token = req.headers.authorization;
      const jwt = new JWTUtil();
      const decoded = await jwt.decodeToken(token as string) as any;

      const infoLoger = await UserService.getUserById(decoded.id);
      const infoUser = await UserService.getUserById(id);

      if (!infoUser?.data) {
        return ResponseHelper.error(res, "Usuario no encontrado", null, 404);
      }

      infoUser.data.status = infoUser.data.status === "inactive" ? "active" : "inactive";
      infoUser.data.fechaActualizacion = new Date();
      infoUser.data.usuarioActualizacion = infoLoger?.data?.ficha !== undefined
      ? infoLoger.data.ficha.toString() : '';
      const result = await UserService.updateUser(infoUser.data);

      return ResponseHelper.success(res, `Usuario ${infoUser.data.status}`, result, 200);
    } catch (error) {
      logger.error(`[controller/user/deleteUser]: ${error}`);
      return ResponseHelper.error(res, "Error al borrar usuario", null, 500);
    }
  }

   async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const token = req.headers.authorization;
      const jwt = new JWTUtil();
      const decoded = await jwt.decodeToken(token as string) as any;

      const response = await UserService.getUsers();
      return ResponseHelper.success(res, "Usuarios obtenidos", response, 200);
    } catch (error) {
      logger.error(`[controller/user/getUsers]: ${error}`);
      return ResponseHelper.error(res, "Error al obtener usuarios", null, 500);
    }
  }

   async getAdminUsers(req: Request, res: Response): Promise<any> {
    try {
      const response = await UserService.getAdminUsers();
      return ResponseHelper.success(res, "Usuarios admin obtenidos", response, 200);
    } catch (error) {
      logger.error(`[controller/user/getAdminUsers]: ${error}`);
      return ResponseHelper.error(res, "Error al obtener usuarios admin", null, 500);
    }
  }

   async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const id = Number(req.params.id);
      const response = await UserService.getUserById(id);

      if (!response) {
        return ResponseHelper.error(res, "Usuario no encontrado", null, 404);
      }

      return ResponseHelper.success(res, "Usuario encontrado", response, 200);
    } catch (error) {
      logger.error(`[controller/user/getUserById]: ${error}`);
      return ResponseHelper.error(res, "Error al obtener usuario", null, 500);
    }
  }
}