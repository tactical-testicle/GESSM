import CatSubgerenciaController from '../controllers/catSubgerencia.controller';
import { Router, Request, Response } from "express";

const catSubgerenciaRouter = Router()
const catSubgerenciaController = new CatSubgerenciaController()

catSubgerenciaRouter.post('/', catSubgerenciaController.createCatSubgerencia.bind(catSubgerenciaController))
catSubgerenciaRouter.get('/', catSubgerenciaController.getCatSubgerencias.bind(catSubgerenciaController))
catSubgerenciaRouter.post('/delete', catSubgerenciaController.delete.bind(catSubgerenciaController))

export default catSubgerenciaRouter;
