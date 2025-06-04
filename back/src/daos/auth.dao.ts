///////SECCION PAR CONSULTAS A BASE DE DATOS 2

import logger from "../../lib/logger";
import { pool } from "../config/db";
import  IUser  from "../interfaces/user.interface";


export class AuthDAO {
    static async findByEmail(email: string){
        try{
            const query = `SELECT * FROM users WHERE email=$1`
            const values = [email]
            const result = await pool.query(query,values)
            return result.rows[0]
        }catch(error){
            logger.error(`[DAOS/auth/FindByEmail]: ${error}`)
        }
    }

    static async createUser(user: IUser){
        try{
            const query = `INSERT INTO users(name,email,role,phone,password)
            VALUES($1,$2,$3,$4,$5)
            RETURNING id, name, email, status`
            const values = [user.name,user.email,user.role,user.phone,user.password]
            const result = await pool.query(query,values)
            return result.rows[0]
        }catch(error){
            logger.error(`[DAOS/auth/register]: ${error}`)
        }
    }
}