import { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response.helper";
import logger from "../../lib/logger";
import { FolioService } from "../services/folio.service";
import { UserService } from "../services/user.service";
import { CatSubgerenciaService } from "../services/catSubgerencia.service";
import { CatGerenciaService } from "../services/catGerencia.service";
import { CatSuperintendenciaService } from "../services/catSuperintendencia.service";
import { CatFolioService } from "../services/catFolio.service";
import { CatFolioFCFService } from "../services/catFolioFCF.service";
import CatFolioFCFController from "./catFolioFCF.controller";
import { FoliosUtils } from "../utils/folios.util";
import JWTUtil from "../utils/jwt.util";

export default class FolioController {
    async createFolio(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.authorization;
            const body = req.body;
            const user = await new JWTUtil().decodeToken(token!) as any;

            const listIds = await new FoliosUtils().arrayDestinatarios(body.destinatarios);
            if (!listIds) return ResponseHelper.error(res, "Invalid destinatarios", null, 400);
            body.destinatarios = listIds;

            const exist = await FolioService.getExisteNoAcuerdo(body.noAcuerdosGESSM);
            if (exist > 0) return ResponseHelper.error(res, "Número de acuerdo duplicado", null, 208);

            const infoUserA = await UserService.getUserByFicha(body.fichaPoder ?? user.ficha);
            const infoUser = infoUserA?.data
            if (!infoUser) {
                return ResponseHelper.error(res, infoUserA.message, null, infoUserA.code)
            }
            const subgerencia = await CatSubgerenciaService.getCatSubgerencia(infoUser.subgerencia);
            const gerencia = await CatGerenciaService.getCatGerencia(infoUser.gerencia);
            const superintendencia = await CatSuperintendenciaService.getCatSuperintendencia(infoUser.superintendencia);

            const tipoFolioId = body.tipoFolio.toString();
            const count = await FolioService.getFolioConsecutivo(tipoFolioId);
            body.noConsecutivo = count + 1;
            body.usuarioCreacion = (body.fichaPoder ?? user.ficha).toString();
            body.rubricasElaboracion = Array.isArray(body.rubricasElaboracion) && body.rubricasElaboracion.length > 0
                ? body.rubricasElaboracion
                : [infoUser.rubrica];

            const catFolioObj = await CatFolioService.getCatFolio(tipoFolioId);

            body.noOficio = (catFolioObj.response?.nombre === "OFICIO" ? `DAS-${gerencia.response?.siglas}` : `TARJETA:${gerencia.response?.siglas}`);
            if (subgerencia?.response?.siglas) body.noOficio += `-${subgerencia?.response?.siglas}`;
            if (superintendencia?.response?.siglas) body.noOficio += `-${superintendencia?.response?.siglas}`;
            body.noOficio += `-${body.noConsecutivo}-${new Date().getFullYear()}`;

            if (body.isFolioFCF === true) {
                if (await CatFolioFCFService.existeCatFolioFCFActivo()) {
                    body.folioFCFp = (await CatFolioFCFService.folioFCFDisponible()) ?? 0;
                    if (body.folioFCFp > 0) {
                        await CatFolioFCFService.takeFolioFCF(body.folioFCFp, body.noOficio, token!);
                    }
                } else {
                    return ResponseHelper.error(res, "No hay folioFCF libre", null, 208);
                }
            }

            const result = await FolioService.createFolio(body);
            return ResponseHelper.success(res, "Successfull", body.noOficio, 200);

        } catch (error) {
            logger.error(`[folio.controller/createFolio]: ${error}`);
            return ResponseHelper.error(res, "Internal Server Error", error, 500);
        }
    }

    async updateFolio(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;
            body.fechaActualizacion = new Date();
            const updated = await FolioService.updateFolio(body);
            return ResponseHelper.success(res, "Updated successfully", updated, 200);
        } catch (error) {
            logger.error(`[folio.controller/updateFolio]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }

    async deleteFolio(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.body;
            const token = req.headers.authorization;
            const user = await new JWTUtil().decodeToken(token!) as any;

            const infoUser = await UserService.getUserById(user.id);
            const infoFolio = await FolioService.getFolioById(id);
            if (infoFolio) {
                infoFolio.status = infoFolio.status === 'inactive' ? 'active' : 'inactive';
                infoFolio.fechaActualizacion = new Date();
                infoFolio.usuarioActualizacion = infoUser.data?.ficha.toString();
            } else {
                throw new Error('Folio no encontrado');
            }

            const updated = await FolioService.updateFolio(infoFolio);
            return ResponseHelper.success(res, "Successfull", updated, 200);
        } catch (error) {
            logger.error(`[folio.controller/deleteFolio]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }

    async changeTramite(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.body;
            const token = req.headers.authorization;
            const user = await new JWTUtil().decodeToken(token!) as any;
            const infoUser = await UserService.getUserById(user.id);
            const infoFolio = await FolioService.getFolioById(id);
            if (infoFolio) {
                infoFolio.tramitado = !infoFolio.tramitado;
                infoFolio.fechaActualizacion = new Date();
                infoFolio.usuarioActualizacion = infoUser.data?.ficha.toString();
            } else {
                throw new Error('Folio no encontrado');
            }
            const updated = await FolioService.updateFolio(infoFolio);
            return ResponseHelper.success(res, "Successfull", updated, 200);
        } catch (error) {
            logger.error(`[folio.controller/changeTramite]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }

    async getFolios(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.authorization;
            const user = await new JWTUtil().decodeToken(token!) as any;
            console.log("user en getFolios: ", user)
            const infoUser = await UserService.getUserByFicha(user.user.ficha);

            if (!infoUser.data?.ficha) {
                return ResponseHelper.error(res, 'Ficha no disponible para el usuario', null, 400);
            }
console.log("rol del infoUser: ",infoUser.data?.role)
            const data = infoUser.data?.role === "ADMIN"
                ? await FolioService.getFolios()
                : await FolioService.getFoliosFicha(infoUser.data.ficha.toString());

            return ResponseHelper.success(res, "Successfull", data, 201);
        } catch (error) {
            logger.error(`[folio.controller/getFolios]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }

    async getFoliosAnuo(req: Request, res: Response): Promise<any> {
        try {
            const { anuo } = req.params;
            const token = req.headers.authorization;
            const user = await new JWTUtil().decodeToken(token!) as any;
            const infoUser = await UserService.getUserByFicha(user.ficha);
            if (!infoUser.data?.ficha) {
                return ResponseHelper.error(res, 'Ficha no disponible para el usuario', null, 400);
            }

            const data = infoUser.data?.role === "ADMIN"
                ? await FolioService.getFoliosAnio(Number(anuo))
                : await FolioService.getFoliosFichaAnio(infoUser.data.ficha.toString(), Number(anuo));

            return ResponseHelper.success(res, "Successfull", data, 201);
        } catch (error) {
            logger.error(`[folio.controller/getFoliosAnuo]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }

    async getFoliosPorMes(req: Request, res: Response): Promise<any> {
        try {
            const result = await FolioService.getFoliosPorMes();
            return res.status(200).json(result);
        } catch (error) {
            logger.error(`[folio.controller/getFoliosPorMes]: ${error}`);
            return res.status(500).json({ ok: false, message: "Error occurred", error });
        }
    }

    async getFolioById(req: Request, res: Response): Promise<any> {
        try {
          const { id } = req.params;
    
          if (!id) {
            return ResponseHelper.error(res, 'ID no proporcionado', null, 400);
          }
    
          const folio = await FolioService.getFolioById(id);
    
          if (!folio) {
            return ResponseHelper.error(res, 'Folio no encontrado', null, 404);
          }
    
          return ResponseHelper.success(res, 'Folio encontrado', folio, 200);
        } catch (error) {
          logger.error(`[controller/folio/getFolioById]: ${error}`);
          return ResponseHelper.error(res, 'Error al obtener folio', null, 500);
        }
      }

    async generarMenu(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.authorization;
            if(!token){
                console.log("No se recibio token.")
                return ResponseHelper.error(res, "No se recibio token.", null, 401);
            }
            const user = await new JWTUtil().decodeToken(token!) as any;
            if(user == false){
                return ResponseHelper.success(res, "Token ha expirado", user, 401);
            }
            console.log("va a mandar a buscar la ficha: "+ user.ficha)
            const infoUser = await UserService.getUserByFicha(user.ficha);
            const anios = await FolioService.getAniosFoliosMenu(user.ficha, infoUser.data?.role || "users" );

            const menu = infoUser.data?.role === "ADMIN"
                ? [
                    { name: "Tablero", router: "dashboard" },
                    {
                        name: "Registros",
                        router: "registros",
                        anios: anios.data?.map(anio => ({ title: anio.toString() })) || []
                    },
                    { name: "Usuarios", router: "addUsers" },
                    { name: "Catálogos", router: "addCatalogos" }
                ]
                : [
                    {
                        name: "Registros",
                        router: "registros",
                        anios: anios.data?.map(anio => ({ title: anio.toString() })) || []
                    }
                ];

            return ResponseHelper.success(res, "Successfull", menu, 201);
        } catch (error) {
            logger.error(`[folio.controller/generarMenu]: ${error}`);
            return ResponseHelper.error(res, "Error occurred", error, 500);
        }
    }
}