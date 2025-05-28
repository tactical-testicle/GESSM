import { pool } from '../config/db';
import  IcatSubgerencia  from '../interfaces/catSubgerencia.interface';

export class CatSubgerenciaDAO {
  static async create(body: IcatSubgerencia): Promise<any> {
    const query = `
      INSERT INTO cat_subgerencia (nombre, fechaCreacion, usuarioCreacion, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [body.name, new Date(), body.usuarioCreacion, 'active'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(body: IcatSubgerencia): Promise<any> {
    const query = `
      UPDATE cat_subgerencia
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

  static async findAll(): Promise<IcatSubgerencia[]> {
    const query = 'SELECT * FROM cat_subgerencia';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<IcatSubgerencia | null> {
    const query = 'SELECT * FROM cat_subgerencia WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

   /** Busca por nombre o crea uno nuevo, retornando su ID */
   static async getOrCreateByName(nombre: string): Promise<number> {
    // 1) Intentar encontrar
    const checkQ = `SELECT id FROM cat_subgerencia WHERE nombre = $1`;
    const checkR = await pool.query(checkQ, [nombre]);
    if (checkR.rows.length) {
      return checkR.rows[0].id;
    }
    // 2) Si no existe, crear
    const insertQ = `
      INSERT INTO cat_subgerencia (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), 'bulk-upload', 'active')
      RETURNING id
    `;
    const insertR = await pool.query(insertQ, [nombre]);
    return insertR.rows[0].id;
  }
}