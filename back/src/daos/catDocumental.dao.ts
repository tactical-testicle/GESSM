import { pool } from '../config/db';
import ICatDocumental from '../interfaces/catDocumental.interface';

export class CatDocumentalDAO {
  /** Crea una nueva serie documental */
  static async create(body: ICatDocumental): Promise<ICatDocumental> {
    const query = `
      INSERT INTO cat_documental
        (name, fecha_creacion, usuario_creacion, estatus)
      VALUES ($1, NOW(), $2, 'true')
      RETURNING *;
    `;
    const values = [body.name, body.usuarioCreacion];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /** Obtiene todas las series documentales */
  static async findAll(): Promise<ICatDocumental[]> {
    const query = `SELECT * FROM cat_documental`;
    const result = await pool.query(query);
    return result.rows;
  }

  /** Obtiene una serie documental por su ID */
  static async findById(id: string): Promise<ICatDocumental | null> {
    const query = `SELECT * FROM cat_documental WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /** Actualiza una serie documental existente */
  static async update(body: ICatDocumental): Promise<ICatDocumental | null> {
    const query = `
      UPDATE cat_documental
      SET nombre = $1,
          fecha_actualizacion = NOW(),
          usuario_actualizacion = $2,
          status = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [
      body.name,
      body.usuarioModificacion || '',
      body.estatus,
      body.id
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async updateStatus(id: string, estatus: boolean): Promise<ICatDocumental> {
      const result = await pool.query(
        `UPDATE cat_Documental SET estatus = $1, fecha_actualizacion = $2 WHERE id = $3 RETURNING *`,
        [estatus, new Date(), id]
      );
      return result.rows[0];
    }
    
  /** Busca por nombre o crea si no existe, devolviendo el ID */
  static async getOrCreateByName(nombre: string): Promise<number> {
    // 1) Intentar encontrar
    const checkQ = `SELECT id FROM cat_documental WHERE nombre = $1`;
    const checkR = await pool.query(checkQ, [nombre]);
    if (checkR.rows.length) {
      return checkR.rows[0].id;
    }
    // 2) Crear si no existe
    const insertQ = `
      INSERT INTO cat_documental (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), 'bulk-upload', 'active')
      RETURNING id
    `;
    const insertR = await pool.query(insertQ, [nombre]);
    return insertR.rows[0].id;
  }
}