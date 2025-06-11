import { pool } from "../config/db";
import ICatFolioFCF from "../interfaces/catFolioFCF.interface";

export class CatFolioFCFDAO {
  /** Crea un nuevo folio FCF */
  static async create(body: ICatFolioFCF): Promise<ICatFolioFCF> {
    const query = `
      INSERT INTO cat_folios_fcf
        (nombre, cantidad_fcf, inicio_fcf, folio_fcf, assigned_folio,
         fecha_creacion, usuario_creacion, status)
      VALUES ($1,$2,$3,$4,$5, NOW(), $6, $7)
      RETURNING *;
    `;
    const values = [
      body.nombre,
      body.cantidadFCF,
      body.inicioFCF,
      body.folioFCF,
      body.assignedFolio,
      body.usuarioCreacion,
      body.estatus
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  /** Actualiza un folio FCF existente */
  static async update(body: ICatFolioFCF): Promise<ICatFolioFCF | null> {
    const query = `
      UPDATE cat_folios_fcf
      SET nombre             = $1,
          cantidad_fcf       = $2,
          inicio_fcf         = $3,
          folio_fcf          = $4,
          assigned_folio     = $5,
          fecha_actualizacion = NOW(),
          usuario_actualizacion = $6,
          status             = $7
      WHERE id = $8
      RETURNING *;
    `;
    const values = [
      body.nombre,
      body.cantidadFCF,
      body.inicioFCF,
      body.folioFCF,
      body.assignedFolio,
      body.usuarioModificacion || "",
      body.estatus,
      body.id
    ];
    const res = await pool.query(query, values);
    return res.rows[0] || null;
  }

  /** Verifica si existe algún folio FCF con status = true */
  static async existsActive(): Promise<boolean> {
    const query = 'SELECT 1 FROM cat_folios_fcf WHERE status = true LIMIT 1';
    const res = await pool.query(query);
    return (res.rowCount ?? 0) > 0;
  }

  /** Obtiene todos los folios FCF */
  static async findAll(): Promise<ICatFolioFCF[]> {
    const query = 'SELECT * FROM cat_folios_fcf';
    const res = await pool.query(query);
    return res.rows;
  }

  /** Devuelve el primer folioFCF con status = true */
  static async findOneActive(): Promise<number | null> {
    const query = `
      SELECT folio_fcf
      FROM cat_folios_fcf
      WHERE status = true
      LIMIT 1
    `;
    const res = await pool.query(query);
    return res.rows[0]?.folio_fcf ?? null;
  }

  /** Busca un folio FCF por su número */
  static async findByFolio(folioFCF: number): Promise<ICatFolioFCF | null> {
    const query = `
      SELECT * FROM cat_folios_fcf
      WHERE folio_fcf = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [folioFCF]);
    return res.rows[0] || null;
  }

  /** Inserta en bulk (carga masiva) */
  static async bulkCreate(bulk: ICatFolioFCF[]): Promise<number> {
    // Para simplicidad, insertamos uno a uno en transacción
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertQ = `
        INSERT INTO cat_folios_fcf
          (nombre, cantidad_fcf, inicio_fcf, folio_fcf, assigned_folio,
           fecha_creacion, usuario_creacion, status)
        VALUES ($1,$2,$3,$4,$5,NOW(),$6,$7)
      `;
      for (const b of bulk) {
        await client.query(insertQ, [
          b.nombre,
          b.cantidadFCF,
          b.inicioFCF,
          b.folioFCF,
          b.assignedFolio,
          b.usuarioCreacion,
          b.estatus
        ]);
      }
      await client.query("COMMIT");
      return bulk.length;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}