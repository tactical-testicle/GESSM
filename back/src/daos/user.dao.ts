import { pool } from '../config/db'; // Asegúrate que tu archivo de conexión esté en esa ruta
import  IUser  from '../interfaces/user.interface';

export class UserDAO {
  static async findAll(): Promise<IUser[]> {
    const result = await pool.query('SELECT * FROM users WHERE status = $1', ['active']);
    return result.rows;
  }

  static async findById(id: number): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByFicha(ficha: number): Promise<IUser | null> {
    console.log('ficha',ficha)
    const result = await pool.query(`SELECT * FROM users WHERE ficha = $1`, [ficha]);
    console.log(result.rows[0])
    return result.rows[0] || null;
  }

  static async create(user: IUser): Promise<IUser> {
    const query = `
      INSERT INTO users (name, password, ficha, status, role, usuario_creacion, fecha_creacion, nivel, salt, gerencia, rubrica)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      user.name,
      user.password,
      user.ficha,
      user.status,
      user.role,
      user.usuarioCreacion,
      user.nivel,
      "sdfjhaselirgbhlbiluehfkanoiusalt123-algo-ais-jajaja",
      user.gerencia,
      user.rubrica
    ];
    console.log(values)
    console.log(query)
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(user: IUser): Promise<IUser> {
    const query = `
      UPDATE users SET
        name = $1,
        password = $2,
        ficha = $3,
        status = $4,
        role = $5,
        usuario_modificacion = $6,
        fecha_modificacion = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      user.name,
      user.password,
      user.ficha,
      user.status,
      user.role,
      user.usuarioActualizacion,
      user.id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  static async findAdmins(): Promise<IUser[]> {
    const result = await pool.query('SELECT * FROM users WHERE "adminUser" = true');
    return result.rows;
  }
}