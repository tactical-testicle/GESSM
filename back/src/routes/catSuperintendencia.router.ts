import CatSuperintendenciaController from '../controllers/catSuperintendencia.controller';
import { Router, Request, Response } from "express";

const catSuperintendenciaRouter = Router()
const catSuperintendenciaController = new CatSuperintendenciaController()

catSuperintendenciaRouter.post('/', catSuperintendenciaController.createCatSuperintendencia.bind(catSuperintendenciaController))
catSuperintendenciaRouter.get('/', catSuperintendenciaController.getCatSuperintendencias.bind(catSuperintendenciaController))
catSuperintendenciaRouter.post('/delete', catSuperintendenciaController.delete.bind(catSuperintendenciaController))

export default catSuperintendenciaRouter;
