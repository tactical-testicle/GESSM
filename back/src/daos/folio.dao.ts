import { pool } from '../config/db';
import   IFolio  from '../interfaces/folio.interface';

export class FolioDAO {
  static async createFolio(body: IFolio): Promise<any> {
    const result = await pool.query(
      `INSERT INTO folio (tipo_folio, destinatarios, remitente, subgerencia, superintendencia, anexos, is_folio_fcf, asunto, antecedentes, no_acuerdos_gessm, observaciones, rubricas_elaboracion, usuario_creacion, no_oficio, tema, tramitado, serie_documental, folio_fcfp, fecha_creacion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW())
       RETURNING *`,
      [
        body.tipoFolio,
        body.destinatarios,
        body.remitente,
        body.subgerencia,
        body.superintendencia,
        body.anexos,
        body.isFolioFCF,
        body.asunto,
        body.antecedentes,
        body.noAcuerdosGESSM,
        body.observaciones,
        body.rubricasElaboracion,
        body.usuarioCreacion,
        body.noOficio,
        body.tema,
        body.tramitado,
        body.serieDocumental,
        body.folioFCFp ?? null,
      ]
    );
    return result.rows[0];
  }

  static async findFoliosByUser(userFicha: string): Promise<IFolio[]> {
    const result = await pool.query(
      'SELECT * FROM folio WHERE usuario_creacion = $1 ORDER BY fecha_creacion DESC',
      [userFicha]
    );
    return result.rows;
  }

  static async findFoliosByUserAndYear(userFicha: string, year: number): Promise<IFolio[]> {
    const result = await pool.query(
      `SELECT * FROM folio
       WHERE usuario_creacion = $1
         AND EXTRACT(YEAR FROM fecha_creacion) = $2
       ORDER BY fecha_creacion DESC`,
      [userFicha, year]
    );
    return result.rows;
  }

  static async findFoliosByYear(year: number): Promise<IFolio[]> {
    const result = await pool.query(
      `SELECT * FROM folio
       WHERE EXTRACT(YEAR FROM fecha_creacion) = $1
       ORDER BY fecha_creacion DESC`,
      [year]
    );
    return result.rows;
  }

  static async countByTipoFolioAndYear(tipoFolioId: string, year: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM folio
       WHERE tipo_folio = $1
         AND EXTRACT(YEAR FROM fecha_creacion) = $2`,
      [tipoFolioId, year]
    );
    return parseInt(result.rows[0].count, 10);
  }

  static async getAniosUnicos(ficha: string | null): Promise<number[]> {
    const query = ficha && ficha !== 'ADMIN'
      ? `SELECT DISTINCT EXTRACT(YEAR FROM fecha_creacion) as anio FROM folio WHERE usuario_creacion = $1 ORDER BY anio DESC`
      : `SELECT DISTINCT EXTRACT(YEAR FROM fecha_creacion) as anio FROM folio ORDER BY anio DESC`;

    const result = ficha && ficha !== 'ADMIN'
      ? await pool.query(query, [ficha])
      : await pool.query(query);

    return result.rows.map(row => parseInt(row.anio));
  }

    static async generateNombreFolio(folio: any, infoSubgerencia: any, infoSuperintendencia: any): Promise<string> {
      try {
        // Obtener el nombre del tipoFolio desde cat_folio
        const tipoFolioQuery = 'SELECT nombre FROM cat_folio WHERE id = $1';
        const result = await pool.query(tipoFolioQuery, [folio.tipoFolio]);
  
        const tipoFolioNombre = result.rows[0]?.nombre;
  
        if (!tipoFolioNombre) {
          throw new Error('Tipo de folio no encontrado');
        }
  
        const anioActual = new Date().getFullYear();
        let noOficio = '';
  
        if (tipoFolioNombre === 'OFICIO') {
          noOficio = 'DCAS-SSE-GESSM';
        } else {
          noOficio = 'TARJETA:GESSM';
        }
  
        if (infoSubgerencia?.siglas) {
          noOficio += `-${infoSubgerencia.siglas}`;
        }
  
        if (infoSuperintendencia?.siglas && infoSubgerencia?.siglas) {
          noOficio += `-${infoSuperintendencia.siglas}`;
        }
  
        noOficio += `-${folio.noConsecutivo}-${anioActual}`;
  
        console.log('Nombre final:', noOficio);
        return noOficio;
      } catch (err) {
        console.error('[DAO/generateNombreFolio]', err);
        throw err;
      }
    }
    
    static async bulkInsert(folios: any[]): Promise<any[]> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        const inserted: any[] = [];
        const insertText = `
          INSERT INTO folio
            (tipo_folio, remitente, subgerencia, superintendencia, anexos,
             is_folio_fcf, asunto, antecedentes, no_acuerdos_gessm, observaciones,
             rubricas_elaboracion, usuario_creacion, no_oficio, tema, tramitado,
             serie_documental, folio_fcfp)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          RETURNING *;
        `;
  
        for (const f of folios) {
          const values = [
            f.tipoFolio,
            f.remitente,
            f.subgerencia,
            f.superintendencia,
            f.anexos,
            f.isFolioFCF,
            f.asunto,
            f.antecedentes,
            f.noAcuerdosGESSM,
            f.observaciones,
            // Guardamos el arreglo de rúbricas como JSON
            JSON.stringify(f.rubricasElaboracion),
            f.usuarioCreacion,
            f.noOficio,
            f.tema,
            f.tramitado,
            f.serieDocumental,
            // folioFCFp puede ser opcional
            f.folioFCFp ?? null
          ];
          const res = await client.query(insertText, values);
          inserted.push(res.rows[0]);
          // Si necesitas también relacionar destinatarios en una tabla puente,
          // aquí podrías iterar f.destinatarios y hacer los INSERT correspondientes.
        }
  
        await client.query('COMMIT');
        return inserted;
  
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('[DAO/folio.bulkInsert] Error:', err);
        throw err;
      } finally {
        client.release();
      }
    }
}