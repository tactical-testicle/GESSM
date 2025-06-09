import { pool } from '../config/db';
import  ICatGerencia  from '../interfaces/catGerencia.interface';

export class CatGerenciaDAO {
  static async create(body: ICatGerencia): Promise<any> {
    const query = `
      INSERT INTO cat_gerencia (nombre, fecha_creacion, usuario_creacion, status, siglas)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [body.nombre, new Date(), body.usuarioCreacion, 'active', body.siglas];
    console.log("values: ", values)
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
      body.nombre,
      new Date(),
      body.fechaModificacion || '',
      body.estatus,
      body.id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<ICatGerencia[]> {
    console.log("3")
    const query = 'SELECT * FROM cat_gerencia';
    const result = await pool.query(query);
    console.log("findAll gerencias: ", result)
    return result.rows;
  }

  static async findById(id: string): Promise<ICatGerencia | null> {
    const query = 'SELECT * FROM cat_gerencia WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}