import CatIncidenciaController from '../controllers/catIncidencia.controller';
import { Router, Request, Response } from "express";

const catIncidenciaRouter = Router()
const catIncidenciaController = new CatIncidenciaController()

catIncidenciaRouter.post('/', catIncidenciaController.createCatIncidencia.bind(catIncidenciaController))
catIncidenciaRouter.get('/', catIncidenciaController.getCatIncidencias.bind(catIncidenciaController))
catIncidenciaRouter.get('/totalEstado', catIncidenciaController.getTotalEstado.bind(catIncidenciaController))
catIncidenciaRouter.post('/delete', catIncidenciaController.delete.bind(catIncidenciaController))

export default catIncidenciaRouter;
