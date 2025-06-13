import { FolioDAO } from '../daos/folio.dao';
import  IFolio  from '../interfaces/folio.interface';
import logger from '../../lib/logger';
import csv from 'csvtojson';
import { CatDestinatarioDAO } from '../daos/catDestinatario.dao';
import { CatRemitenteDAO } from '../daos/catRemitente.dao';
import { CatSubgerenciaDAO } from '../daos/catSubgerencia.dao';
import { CatSuperintendenciaDAO } from '../daos/catSuperintendencia.dao';
import { CatDocumentalDAO } from '../daos/catDocumental.dao';
import { CatFolioFCFDAO } from '../daos/catFolioFCF.dao';

export class FolioService {
  static async createFolio(data: IFolio) {
    try {
      const folio = await FolioDAO.createFolio(data);
      return {
        ok: true,
        data: folio,
        code: 201
      };
    } catch (error) {
      logger.error(`[FolioService/createFolio] ${error}`);
      return {
        ok: false,
        message: 'Error al crear folio',
        code: 500
      };
    }
  }
  static async updateFolio(body: Partial<IFolio>) {
    try {
      const updated = await FolioDAO.update(body);
      return updated;
    } catch (error) {
      logger.error(`[service/folio/updateFolio]: ${error}`);
      throw error;
    }
  }
  static async getFoliosFicha(ficha: string) {
    try {
      const folios = await FolioDAO.findFoliosByUser(ficha);
      return {
        ok: true,
        data: folios,
        code: 200
      };
    } catch (error) {
      logger.error(`[FolioService/getFoliosFicha] ${error}`);
      return {
        ok: false,
        message: 'Error al obtener folios por ficha',
        code: 500
      };
    }
  }
  
  static async getFolioById(id: string) {
    try {
      const folio = await FolioDAO.findById(id);
      return folio;
    } catch (error) {
      logger.error(`[service/folio/getFolioById]: ${error}`);
      throw error;
    }
  }
  
  static async getFoliosFichaAnio(ficha: string, anio: number) {
    try {
      const folios = await FolioDAO.findFoliosByUserAndYear(ficha, anio);
      return {
        ok: true,
        data: folios,
        code: 200
      };
    } catch (error) {
      logger.error(`[FolioService/getFoliosFichaAnio] ${error}`);
      return {
        ok: false,
        message: 'Error al obtener folios por año y ficha',
        code: 500
      };
    }
  }

  static async getFoliosAnio(anio: number) {
    try {
      const folios = await FolioDAO.findFoliosByYear(anio);
      return {
        ok: true,
        data: folios,
        code: 200
      };
    } catch (error) {
      logger.error(`[FolioService/getFoliosAnio] ${error}`);
      return {
        ok: false,
        message: 'Error al obtener folios del año',
        code: 500
      };
    }
  }

  static async getConsecutivo(tipoFolioId: string) {
    try {
      const year = new Date().getFullYear();
      const count = await FolioDAO.countByTipoFolioAndYear(tipoFolioId, year);
      return count;
    } catch (error) {
      logger.error(`[FolioService/getConsecutivo] ${error}`);
      throw error;
    }
  }

  static async getFolios() {
    try {
      const folios = await FolioDAO.findAll();

      const foliosPorAnio = folios.reduce((acc: any, folio: any) => {
        const anio = new Date(folio.fechaCreacion).getFullYear();
        if (!acc[anio]) {
          acc[anio] = { anio, folios: [] };
        }
        acc[anio].folios.push(folio);
        return acc;
      }, {});

      const resultado = Object.values(foliosPorAnio);
      return resultado;
    } catch (err) {
      logger.error(`[folio.service/getFolios] ${err}`);
      throw err;
    }
  }

  static async getAniosFoliosMenu(ficha: string, role: string) {
    try {
      console.log("ficha: "+ficha +" es Admin: "+role)
      const anios = await FolioDAO.getAniosUnicos(ficha, role);
      return {
        ok: true,
        data: anios,
        code: 200
      };
    } catch (error) {
      logger.error(`[FolioService/getAniosFoliosMenu] ${error}`);
      return {
        ok: false,
        message: 'Error al obtener años únicos de folios',
        code: 500
      };
    }
  }
  
  static async getExisteNoAcuerdo(noAcuerdosGESSM: string): Promise<number> {
    try {
      const count = await FolioDAO.countByNoAcuerdo(noAcuerdosGESSM);
      return count;
    } catch (err) {
      logger.error(`[service/folio/getExisteNoAcuerdo]: ${err}`);
      throw err;
    }
  }

  static async getFoliosPorMes(): Promise<any> {
    try {
      const folios = await FolioDAO.getFoliosTipo();

      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo",
        "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const oficiosPorMes = new Array(12).fill(0);
      const tarjetasPorMes = new Array(12).fill(0);

      folios.forEach((folio: any) => {
        const mes = new Date(folio.fecha_creacion).getMonth();
        const tipoFolio = folio.tipo_folio_nombre;

        if (tipoFolio === "OFICIO") {
          oficiosPorMes[mes]++;
        } else if (tipoFolio === "TARJETA") {
          tarjetasPorMes[mes]++;
        }
      });

      return {
        data: {
          labels: meses,
          datasets: [
            {
              type: "bar" as const,
              label: "OFICIOS",
              data: oficiosPorMes,
              backgroundColor: "#9F2441",
            },
            {
              type: "bar" as const,
              label: "TARJETAS",
              data: tarjetasPorMes,
              backgroundColor: "#BC955C",
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error en getFoliosPorMes (service):", error);
      throw error;
    }
  }

  static async getFolioConsecutivo(tipoFolioId: number): Promise<number> {
    try {
      console.log("llego el tipoFolioId en getFolioConsecutivo: ", tipoFolioId)
      const currentYear = new Date().getFullYear();
      const count = await FolioDAO.countConsecutivo(tipoFolioId, currentYear);
      return count;
    } catch (err) {
      logger.error(`[service/folio/getFolioConsecutivo]: ${err}`);
      throw err;
    }
  }
  static async bulkUploadFromCSV(filePath: any): Promise<any> {
    try {
      const foliosArray = await csv().fromFile(filePath.tempFilePath);
      const validFolios = [];

      for (const folio of foliosArray) {
        const destinatarios = folio.destinatarios ? folio.destinatarios.split(',') : [];
        const remitente = folio.remitente?.trim() || null;
        const subgerencia = folio.subgerencia?.trim() || null;
        const superintendencia = folio.superintendencia?.trim() || null;
        const anexos = folio.anexos?.trim().toLowerCase() === "si";
        const documental = folio.documental?.trim() || null;
        const tramitado = folio.tramitado?.trim().toLowerCase() === "si";
        const isFolioFCF = folio.isFolioFCF?.trim().toLowerCase() === "si";
        const folioFCF = folio.folioFCF?.trim() || null;

        const destinatariosIds = await Promise.all(
          destinatarios.map((nombre: string) => CatDestinatarioDAO.getOrCreateDestinatario(nombre.trim()))
        );

        const remitenteId = remitente ? await CatRemitenteDAO.getOrCreateByName(remitente) : null;
        const subgerenciaId = subgerencia ? await CatSubgerenciaDAO.getOrCreateByName(subgerencia) : null;
        const superintendenciaId = superintendencia ? await CatSuperintendenciaDAO.getOrCreateByName(superintendencia) : null;
        const documentalId = documental ? await CatDocumentalDAO.getOrCreateByName(documental) : null;

        const noOficio = await FolioDAO.generateNombreFolio(folio, subgerenciaId, superintendenciaId);

        if (folioFCF) {
          await CatFolioFCFDAO.create({
            nombre: "carga masiva",
            id: 0,
            cantidadFCF: 1,
            inicioFCF: Number(folioFCF),
            folioFCF: Number(folioFCF),
            assignedFolio: noOficio,
            fechaCreacion: new Date(),
            fechaModificacion: new Date(),
            usuarioCreacion: "carga masiva",
            usuarioModificacion: "carga masiva",
            estatus: false
          });
        }

        const newFolio: any = {
          tipoFolio: folio.tipoFolio,
          destinatarios: destinatariosIds,
          remitente: remitenteId,
          subgerencia: subgerenciaId,
          superintendencia: superintendenciaId,
          anexos,
          isFolioFCF,
          asunto: folio.asunto,
          antecedentes: folio.antecedentes,
          noAcuerdosGESSM: folio.noAcuerdosGESSM,
          observaciones: folio.observaciones,
          rubricasElaboracion: folio.rubricasElaboracion,
          usuarioCreacion: "carga masiva",
          noOficio,
          tema: folio.tema,
          tramitado,
          serieDocumental: documentalId
        };

        if (folioFCF) {
          newFolio.folioFCFp = Number(folioFCF);
        }

        validFolios.push(newFolio);
      }

      const inserted = await FolioDAO.bulkInsert(validFolios);

      return {
        message: "Carga masiva completada con éxito.",
        insertedCount: inserted.length
      };
    } catch (err) {
      console.error("Error en bulkUploadFromCSV:", err);
      throw err;
    }
  }
}
