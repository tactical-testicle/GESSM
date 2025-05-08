import logger from '../../lib/logger'
import { pool } from '../config/db'
import IProdcut from '../interfaces/product.interface'

export default class ProductDAO {
    static async getaAllProduct(){
        try{
            const query = 'SELECT * FROM products ORDER BY id'
            const result = await pool.query(query)
            return result.rows[0]
        }catch(error){
            logger.error(`[Error/getAllProductsDAO]: ${error}`)
        }
    }

    static async getBiIdProdcut(id: number){
        try{
            const query = 'SELECT * FROM products WHERE id=$1'
            const values = [id]
            const result = await pool.query(query,values)
            return result.rows[0]
        }catch(error){
            logger.error(`[Error/getByIdDAO]: ${error}`)
        }
    }

    static async createProduct(data: IProdcut){
        try{
            const query = `INSERT INTO products(name,description,price)
            VALUES($1,$2,$3) RETURNING *`
            const values = [data.name,data.description,data.price]
            const result = await pool.query(query,values)
            return result.rows[0]            
        }catch(error){
            logger.error(`[Error/createProduct]: ${error}`)
        }
    }

    static async deleteProduct(id: number){
        try{
            const query = ``
            const values = [id]
            
        }catch(error){
            logger.error(`[Error/deleteProduct]: ${error}`)
        }
    }

}