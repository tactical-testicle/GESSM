import { pool } from '../config/db';
import  ICatGerencia  from '../interfaces/catGerencia.interface';

export class CatGerenciaDAO {
  static async create(body: ICatGerencia): Promise<any> {
    const query = `
      INSERT INTO cat_gerencia (nombre, fechaCreacion, usuarioCreacion, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [body.name, new Date(), body.usuarioCreacion, 'active'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(body: ICatGerencia): Promise<any> {
    const query = `
      UPDATE cat_gerencia
      SET nombre = $1,
          fechaActualizacion = $2,
          usuarioActualizacion = $3,
          status = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [
      body.name,
      new Date(),
      body.fechaModificacion || '',
      body.estatus,
      body.id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<ICatGerencia[]> {
    const query = 'SELECT * FROM cat_gerencia';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<ICatGerencia | null> {
    const query = 'SELECT * FROM cat_gerencia WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}