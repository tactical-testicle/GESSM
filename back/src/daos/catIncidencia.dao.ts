import { pool } from '../config/db'; 
import ICatIncidencia from '../interfaces/catIncidencia.interface';

export class CatIncidenciaDAO {
  static async findAll(): Promise<ICatIncidencia[]> {
    const result = await pool.query('SELECT * FROM cat_incidencia WHERE status = $1', ['active']);
    return result.rows;
  }

  static async totalEstado(fecha: Date): Promise<ICatIncidencia[]> {
    const result = await pool.query( `SELECT 
      COUNT(*) AS total_personas,
      COUNT(*) FILTER (WHERE ci.cuenta_como_asistencia = TRUE) AS total_estado_fuerza
      FROM estado_fuerza ef
      JOIN cat_incidencia ci ON ef.incidencia_id = ci.id
      WHERE ef.fecha = $1;`, [fecha]);
    return result.rows;
  }

 static async findById(id: string): Promise<ICatIncidencia | null> {
    const result = await pool.query('SELECT * FROM cat_incidencia WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(nombre: string): Promise<ICatIncidencia | null> {
    const result = await pool.query('SELECT * FROM cat_incidencia WHERE nombre = $1', [nombre]);
    return result.rows[0] || null;
  }

  static async create(Incidencia: ICatIncidencia): Promise<ICatIncidencia> {
    const query = `
      INSERT INTO cat_incidencia (nombre, cuenta_como_asistencia, usuario_creacion, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [Incidencia.nombre, Incidencia.countAssistence, Incidencia.usuarioCreacion, Incidencia.estatus || 'active'];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(Incidencia: ICatIncidencia): Promise<ICatIncidencia> {
    const query = `
      UPDATE cat_incidencia
      SET nombre = $1, cuenta_como_asistencia = $2, usuario_actualizacion = $3, fecha_actualizacion = NOW(), status = $4
      WHERE id = $5
      RETURNING *`;
    const values = [Incidencia.nombre, Incidencia.countAssistence, Incidencia.usuarioModificacion, Incidencia.estatus, Incidencia.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}