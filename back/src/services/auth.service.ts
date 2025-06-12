import logger from "../../lib/logger";
import { AuthDAO } from "../daos/auth.dao";
import { ResponseHelper } from "../helpers/response.helper";
import IUser from "../interfaces/user.interface";
import EncryptioClass from "../utils/encryption";
import JWTUtil from "../utils/jwt.util";


export class AuthService {
  static encryptClass = new EncryptioClass();

  private removeSensitiveData(user: any) {
    let objectUser = user.toObject()
    delete objectUser.password
    delete objectUser.phone
    delete objectUser.created_at

    return objectUser
  }

  static async register(user: IUser): Promise<{
    ok: boolean;
    message: string;
    createdUser?: IUser;
    code: number;
  }> {
    try {
      const existing = await AuthDAO.findByEmail(user.email);
      if (existing) {
        return {
          ok: false,
          message: "User already exists",
          code: 409,
        };
      }

      const hashedPassword = await this.encryptClass.hashPassword(user.password);
      if (!hashedPassword) {
        return {
          ok: false,
          message: "Problem with password",
          code: 400,
        };
      }

      const newUser = {
        ...user,
        password: hashedPassword,
      };

      const createdUser = await AuthDAO.createUser(newUser);
      if (!createdUser) {
        return {
          ok: false,
          message: "Error creating user",
          code: 500,
        };
      }

      return {
        ok: true,
        message: "Successfully created user",
        createdUser,
        code: 201,
      };
    } catch (error) {
      logger.error(`[service/auth/register]: ${error}`);
      return {
        ok: false,
        message: "Internal server error",
        code: 500,
      };
    }
  }

  static async login(ficha: number, password: string) {
    try {
      console.log("Va a revisar si existe la ficha")
      const existing = await AuthDAO.findByFicha(ficha)
      if (!existing) {
        return { ok: false, message: 'No existe esa ficha registrada: ' + ficha, code: 301 }
      }
      console.log("Va a revisar el password")
      const passValid = await this.encryptClass.verifyPassword(password, existing.password)
      console.log("passValid", passValid)
      if (!passValid) {
        return { ok: false, message: 'Invalid data', code: 301 }
      }

      const user = {
        name: existing.name,
        role: existing.role,
        ficha: existing.ficha,
        status: existing.status,
        id: existing.id
      }
      const token = this.encryptClass.generateToken(user)
      return { ok: true, message: 'successfull', token, user }
    } catch (error) {
      logger.error(`[Error/auth/login]: ${error}`)
      return { ok: false, message: 'Internal server error' }
    }
  }

  static async LoginRefresh(user: IUser) {
    try {
      const frontUser = {
        id: user.id,
        name: user.nombre,
        ficha: user.ficha,
        role: user.role,
        status: user.status
      }
      const jwt = new JWTUtil();
      const tokenGen = await jwt.generateToken(frontUser)
      return { ok: true, message: 'Successfull', response: null, code: 200, user: frontUser, token: tokenGen }

    } catch (err) {
      logger.error(`[AuthControll/LoginRefresh] ${err}`)
      return { ok: false, message: 'Error ocurred', response: err, code: 500 }
    }
  }



}
