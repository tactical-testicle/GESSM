import { pool } from '../config/db';
import  ICatFolio  from '../interfaces/catFolio.interface';

export class CatFolioDAO {
  static async create(folio: ICatFolio): Promise<ICatFolio> {
    const query = `
      INSERT INTO cat_folio (nombre, fecha_creacion, usuario_creacion, estatus)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [
      folio.nombre,
      folio.fechaCreacion,
      folio.usuarioCreacion,
      folio.estatus,
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async findAll(): Promise<ICatFolio[]> {
    const res = await pool.query('SELECT * FROM cat_folio');
    return res.rows;
  }

  static async findById(id: number): Promise<ICatFolio | null> {
    const res = await pool.query('SELECT * FROM cat_folio WHERE id = $1', [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  }
}