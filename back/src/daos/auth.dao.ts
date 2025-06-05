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

    static async findByFicha(ficha: number){
        try{
            const query = `SELECT * FROM users WHERE ficha=$1`
            const values = [ficha]
            const result = await pool.query(query,values)
            console.log("resultado: ", result)
            return result.rows[0]
        }catch(error){
            logger.error(`[DAOS/auth/FindByFicha]: ${error}`)
        }
    }

    static async createUser(user: IUser){
        try{
            const query = `INSERT INTO users(name,role,password)
            VALUES($1,$2,$3)
            RETURNING id, name, status`
            const values = [user.name,user.role,user.password]
            const result = await pool.query(query,values)
            return result.rows[0]
        }catch(error){
            logger.error(`[DAOS/auth/register]: ${error}`)
        }
    }
}