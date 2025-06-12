import { pool } from '../config/db';
import ICatDestinatario  from '../interfaces/catDestinatario.interface';

export class CatDestinatarioDAO {
  static async findAll(): Promise<ICatDestinatario[]> {
    const result = await pool.query('SELECT * FROM cat_destinatario WHERE status = $1', ['active']);
    return result.rows;
  }

  static async findById(id: string): Promise<ICatDestinatario | null> {
    const result = await pool.query('SELECT * FROM cat_destinatario WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByNombre(nombre: string): Promise<ICatDestinatario | null> {
    const result = await pool.query('SELECT * FROM cat_destinatario WHERE nombre = $1', [nombre]);
    return result.rows[0] || null;
  }

  static async create(data: ICatDestinatario): Promise<ICatDestinatario> {
    const result = await pool.query(
      `INSERT INTO cat_destinatario (nombre, fecha_creacion, usuario_creacion, status)
       VALUES ($1, NOW(), $2, 'active') RETURNING *`,
      [data.nombre, data.usuarioCreacion]
    );
    return result.rows[0];
  }

  static async updatstatus(id: string, status: boolean): Promise<ICatDestinatario> {
    const result = await pool.query(
      `UPDATE cat_destinatario SET status = $1, fecha_actualizacion = $2 WHERE id = $3 RETURNING *`,
      [status, new Date(), id]
    );
    return result.rows[0];
  }

  static async getOrCreateDestinatario(nombreDestinatario: string): Promise<number> {
    try {
      console.log("Buscando destinatario con nombre:", nombreDestinatario);

      // Buscar si ya existe
      const checkQuery = 'SELECT id FROM cat_destinatario WHERE nombre = $1';
      const checkResult = await pool.query(checkQuery, [nombreDestinatario]);

      if (checkResult.rows.length > 0) {
        const existingId = checkResult.rows[0].id;
        console.log("Ya existe destinatario con ID:", existingId);
        return existingId;
      }

      // Si no existe, crearlo
      console.log("No existe, creando destinatario...");
      const insertQuery = `
        INSERT INTO cat_destinatario (nombre, fecha_creacion, usuario_creacion, status)
        VALUES ($1, NOW(), 'carga masiva', 'active')
        RETURNING id
      `;
      const insertResult = await pool.query(insertQuery, [nombreDestinatario]);
      const newId = insertResult.rows[0].id;

      console.log("Nuevo destinatario creado con ID:", newId);
      return newId;
    } catch (err) {
      console.error('[DAO/getOrCreateDestinatario]', err);
      throw err;
    }
  }
}