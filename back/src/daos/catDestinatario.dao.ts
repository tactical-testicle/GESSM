import { pool } from '../config/db';
import ICatDestinatario  from '../interfaces/catDestinatario.interface';

export class CatDestinatarioDAO {
  static async findAll(): Promise<ICatDestinatario[]> {
    const result = await pool.query('SELECT * FROM cat_destinatario WHERE estatus = true');
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
      `INSERT INTO cat_destinatario (nombre, fechaCreacion, usuarioCreacion, estatus)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.nombre, data.fechaCreacion, data.usuarioCreacion, data.estatus]
    );
    return result.rows[0];
  }

  static async updateStatus(id: string, estatus: boolean): Promise<ICatDestinatario> {
    const result = await pool.query(
      `UPDATE cat_destinatario SET estatus = $1, fechaModificacion = $2 WHERE id = $3 RETURNING *`,
      [estatus, new Date(), id]
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
        INSERT INTO cat_destinatario (nombre, fecha_creacion, usuario_creacion, estatus)
        VALUES ($1, NOW(), 'carga masiva', true)
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