import { pool } from '../config/db';
import  ICatFolio  from '../interfaces/catFolio.interface';

export class CatFolioDAO {
  static async create(folio: ICatFolio): Promise<ICatFolio> {
    const query = `
      INSERT INTO cat_folio (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), $2, 'active')
      RETURNING *`;
    const values = [
      folio.nombre,
      folio.usuarioCreacion
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async findAll(): Promise<ICatFolio[]> {
    const res = await pool.query('SELECT * FROM cat_folio');
    console.log(res.rows)
    return res.rows;
  }

  static async findById(id: number): Promise<ICatFolio | null> {
    const res = await pool.query('SELECT * FROM cat_folio WHERE id = $1', [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  }
}