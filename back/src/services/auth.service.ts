import logger from "../../lib/logger";
import { AuthDAO } from "../daos/auth.dao";
import { ResponseHelper } from "../helpers/response.helper";
import  IUser  from "../interfaces/user.interface";
import EncryptioClass from "../utils/encryption";

export class AuthService {
  static encryptClass = new EncryptioClass();

  private removeSensitiveData(user: any){
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

  static async login(ficha: number, password: string){
    try{
      console.log("Va a revisar si existe la ficha")
      const existing = await AuthDAO.findByFicha(ficha)
      if(!existing){
        return {ok: false, message: 'Incorrect data',code: 301}
      }
      console.log("Va a revisar el password")
      const passValid = await this.encryptClass.verifyPassword(password,existing.password)
      console.log("passValid", passValid)
      /*if(!passValid){
        return {ok: false,message:'Invalid data',code: 301}
      }*/

      const userToken = {
        name: existing.name,
        role: existing.role,
        status: existing.status,
        id: existing.id
      }
      const token = this.encryptClass.generateToken(userToken)
      return {ok: true, message: 'successfull', token}
    }catch(error){
      logger.error(`[Error/auth/login]: ${error}`)
      return {ok: false,message: 'Internal server error'}
    }
  }
  

  

}
