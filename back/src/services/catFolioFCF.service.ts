import { CatFolioFCFDAO } from "../daos/catFolioFCF.dao";
import  ICatFolioFCF  from "../interfaces/catFolioFCF.interface";
import csv from "csvtojson";
import logger from "../../lib/logger";
import JWTUtil from "../utils/jwt.util"
import { UserService } from "../services/user.service";


export class CatFolioFCFService {
  /** Crea un folio FCF */
  static async createCatFolioFCF(body: ICatFolioFCF) {
    try {
      const newF = await CatFolioFCFDAO.create(body);
      return { ok: true, message: "Creado correctamente", response: newF, code: 201 };
    } catch (err) {
      logger.error(`[service/catFolioFCF/create]: ${err}`);
      return { ok: false, message: "Error al crear folio FCF", code: 500 };
    }
  }

  /** Actualiza un folio FCF */
  static async updateCatFolioFCF(body: ICatFolioFCF) {
    try {
      const updated = await CatFolioFCFDAO.update(body);
      return { ok: true, message: "Actualizado correctamente", response: updated, code: 200 };
    } catch (err) {
      logger.error(`[service/catFolioFCF/update]: ${err}`);
      return { ok: false, message: "Error al actualizar folio FCF", code: 500 };
    }
  }

  /** ¿Existe algún folio FCF activo? */
  static async existeCatFolioFCFActivo(): Promise<boolean> {
    try {
      return await CatFolioFCFDAO.existsActive();
    } catch (err) {
      logger.error(`[service/catFolioFCF/existsActive]: ${err}`);
      throw err;
    }
  }

  /** Obtiene todos los folios FCF */
  static async getCatFolioFCFs() {
    try {
      const list = await CatFolioFCFDAO.findAll();
      return { ok: true, message: "Folios FCF obtenidos", response: list, code: 200 };
    } catch (err) {
      logger.error(`[service/catFolioFCF/getAll]: ${err}`);
      return { ok: false, message: "Error al obtener folios FCF", code: 500 };
    }
  }

  /** Devuelve el folio FCF disponible (primer activo) */
  static async folioFCFDisponible() {
    try {
      const val = await CatFolioFCFDAO.findOneActive();
      return { ok: true, message: "Folio FCF disponible", response: val, code: 200 };
    } catch (err) {
      logger.error(`[service/catFolioFCF/disponible]: ${err}`);
      return { ok: false, message: "Error al consultar folio FCF disponible", code: 500 };
    }
  }

  /** Busca un folio FCF por número */
static async getCatFolioFCF(folioFCF: number) {
  try {
    const f = await CatFolioFCFDAO.findByFolio(folioFCF);
    if (!f) {
      return {
        ok: false,
        message: "Folio FCF no encontrado",
        code: 404
      };
    }
    return {
      ok: true,
      message: "Folio FCF encontrado",
      data: f, 
      code: 200
    };
  } catch (err) {
    logger.error(`[service/catFolioFCF/getByFolio]: ${err}`);
    return {
      ok: false,
      message: "Error al buscar folio FCF",
      code: 500
    };
  }
}

  /** Carga masiva desde CSV */
  static async cargaMasivaFromCSV(filePath: any) {
    try {
      const arr: any[] = await csv().fromFile(filePath.tempFilePath);
      // Suponemos que viene un campo 'nombre' para cada linea
      const bulk: ICatFolioFCF[] = arr.map((r: any) => ({
        nombre: r.nombre.trim(),
        id: 0,
        cantidadFCF: Number(r.cantidadFCF),
        inicioFCF: Number(r.inicioFCF),
        folioFCF: Number(r.folioFCF),
        assignedFolio: r.assignedFolio,
        fechaCreacion: new Date(),
        usuarioCreacion: "carga inicial",
        fechaModificacion: undefined,
        usuarioModificacion: undefined,
        estatus: true
      }));
      const count = await CatFolioFCFDAO.bulkCreate(bulk);
      return {
        ok: true,
        message: "Carga masiva completada",
        response: { insertedCount: count },
        code: 201
      };
    } catch (err) {
      logger.error(`[service/catFolioFCF/bulkUpload]: ${err}`);
      return { ok: false, message: "Error en carga masiva", code: 500 };
    }
  }

  static async takeFolioFCF(id: number, nomfolio: string, token: string) {
    try {
      const user = await new JWTUtil().decodeToken(token!) as any;
      const infoUser = await UserService.getUserById(user.id);
  
      const folio = await CatFolioFCFDAO.findByFolio(id);
      if (!folio) {
        return { ok: false, message: "Folio FCF no encontrado", code: 404 };
      }
  
      folio.estatus = false;
      folio.fechaModificacion = new Date();
      folio.usuarioModificacion = infoUser?.data?.ficha?.toString() || 'sistema';
      folio.assignedFolio = nomfolio;
  
      const updated = await CatFolioFCFDAO.update(folio);
      return { ok: true, message: "Folio FCF actualizado", response: updated, code: 200 };
    } catch (error) {
      logger.error(`[service/catFolioFCF/takeFolioFCF]: ${error}`);
      return { ok: false, message: "Error al ocupar folio FCF", code: 500 };
    }
  }

}