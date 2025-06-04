import FolioController from '../controllers/folio.controller';
import { Router, Request, Response } from "express";

const folioRouter = Router()
const folioController = new FolioController()

folioRouter.post('/create', folioController.createFolio.bind(folioController))
folioRouter.get('/read', folioController.getFolios.bind(folioController))
folioRouter.get('/read/:anuo', folioController.getFoliosAnuo.bind(folioController))
folioRouter.post('/update', folioController.updateFolio.bind(folioController))
folioRouter.post('/delete', folioController.deleteFolio.bind(folioController))
folioRouter.post('/changeTramite', folioController.changeTramite.bind(folioController))
folioRouter.get('/:id', folioController.getFolioById.bind(folioController))
folioRouter.get('/statistics/month', folioController.getFoliosPorMes.bind(folioController))
folioRouter.get('/menu/folioAnual', folioController.generarMenu.bind(folioController))

export default folioRouter;
