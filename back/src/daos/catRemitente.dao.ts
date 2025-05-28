import { pool } from '../config/db';
import ICatRemitente from '../interfaces/catRemitente.interface';

export class CatRemitenteDAO {
  /** Crea un nuevo remitente y devuelve el registro insertado */
  static async create(body: ICatRemitente): Promise<ICatRemitente> {
    const query = `
      INSERT INTO cat_remitente
        (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), $2, 'active')
      RETURNING *;
    `;
    const values = [body.nombre, body.usuarioCreacion];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /** Actualiza un remitente existente y devuelve el registro actualizado */
  static async update(body: ICatRemitente): Promise<ICatRemitente | null> {
    const query = `
      UPDATE cat_remitente
      SET nombre = $1,
          fecha_actualizacion = NOW(),
          usuario_actualizacion = $2,
          status = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [
      body.nombre,
      body.usuarioModificacion || '',
      body.estatus,
      body.id
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /** Devuelve todos los remitentes */
  static async findAll(): Promise<ICatRemitente[]> {
    const query = `SELECT * FROM cat_remitente`;
    const result = await pool.query(query);
    return result.rows;
  }

  /** Devuelve un remitente por su ID */
  static async findById(id: string): Promise<ICatRemitente | null> {
    const query = `SELECT * FROM cat_remitente WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /** Busca por nombre o crea uno nuevo, retornando su ID */
  static async getOrCreateByName(nombre: string): Promise<number> {
    // 1) Intentar encontrar
    const checkQ = `SELECT id FROM cat_remitente WHERE nombre = $1`;
    const checkR = await pool.query(checkQ, [nombre]);
    if (checkR.rows.length) {
      return checkR.rows[0].id;
    }
    // 2) Si no existe, crear
    const insertQ = `
      INSERT INTO cat_remitente (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), 'bulk-upload', 'active')
      RETURNING id
    `;
    const insertR = await pool.query(insertQ, [nombre]);
    return insertR.rows[0].id;
  }
}