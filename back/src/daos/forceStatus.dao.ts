import { pool } from '../config/db';
import IForceStatus from '../interfaces/forceStatus.interface';

export class ForceStatusDAO {
  static async findAll(): Promise<IForceStatus[]> {
    const result = await pool.query('SELECT * FROM estado_fuerza WHERE status = $1', ['active']);
    return result.rows;
  }

  static async countEstadoByDay(fecha: Date): Promise<IForceStatus[]> {
    const result = await pool.query(`SELECT  
    COUNT(*) FILTER (WHERE ef.status = 'active') AS total_personas,
    COUNT(*) FILTER (
        WHERE ef.status = 'active' AND ci.cuenta_como_asistencia = TRUE
    ) AS total_estado_fuerza
    FROM estado_fuerza ef
    JOIN cat_incidencia ci ON ef.incidencia_id = ci.id
      WHERE ef.fecha = $1;`, [fecha]);
    return result.rows;
  }

  static async listEstado(): Promise<IForceStatus[]> {
    const result = await pool.query(`SELECT  
    SELECT 
    ef.fecha,
    g.nombre AS gerencia,
    u.ficha,
    u.name AS nombre_usuario,
    ci.nombre AS incidencia,
    ef.observaciones
FROM estado_fuerza ef
JOIN users u ON ef.usuario_id = u.id
JOIN cat_gerencia g ON u.gerencia = g.id
JOIN cat_incidencia ci ON ef.incidencia_id = ci.id
WHERE ef.status = 'active'
ORDER BY ef.fecha, g.nombre, ci.nombre;`)
    return result.rows;
  }

static async listEstadoByDay(fecha: Date): Promise<IForceStatus[]> {
    const result = await pool.query(`SELECT  
    SELECT 
    ef.fecha,
    g.nombre AS gerencia,
    u.ficha,
    u.name AS nombre_usuario,
    ci.nombre AS incidencia,
    ef.observaciones
FROM estado_fuerza ef
JOIN users u ON ef.usuario_id = u.id
JOIN cat_gerencia g ON u.gerencia = g.id
JOIN cat_incidencia ci ON ef.incidencia_id = ci.id
WHERE ef.status = 'active'
  AND ef.fecha = $1
ORDER BY ef.fecha, g.nombre, ci.nombre;`, [fecha])
    return result.rows;
  }

  static async findByFichaDay(usuarioId: number, fecha: Date): Promise<IForceStatus | null> {
    const result = await pool.query('SELECT * FROM estado_fuerza WHERE usuario_id = $1 and fecha = $2', [usuarioId, fecha]);
    return result.rows[0] || null;
  }

  static async create(forceStatus: IForceStatus): Promise<IForceStatus> {
    const query = `
      INSERT INTO estado_fuerza (usuario_id, incidencia_id, fecha, observaciones, usuario_creacion, status)
      VALUES ($1, $2, $3, $4,$5,$6)
      RETURNING *`;
    const values = [forceStatus.usuarioId, forceStatus.incidenciaId, forceStatus.fecha, forceStatus.observaciones, forceStatus.usuarioCreacion, 'active'];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(forceStatus: IForceStatus): Promise<IForceStatus> {
    const query = `
      UPDATE estado_fuerza
      SET usuario_id = $1, incidencia_id = $2, fecha = $3, observaciones = $4, usuario_actualizacion = $5, fecha_actualizacion = NOW(), status = $6
      WHERE id = $7
      RETURNING *`;
    const values = [forceStatus.usuarioId, forceStatus.incidenciaId, forceStatus.fecha, forceStatus.observaciones, forceStatus.usuarioModificacion, forceStatus.estatus, forceStatus.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

    static async findById(id: number): Promise<IForceStatus | null> {
      const result = await pool.query('SELECT * FROM estado_fuerza WHERE id = $1', [id]);
      return result.rows[0] || null;
    }
}