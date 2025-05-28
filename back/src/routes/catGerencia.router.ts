import CatGerenciaController from '../controllers/catGerencia.controller';
import { Router, Request, Response } from "express";

const catGerenciaRouter = Router()
const catGerenciaController = new CatGerenciaController()

catGerenciaRouter.post('/', catGerenciaController.createCatGerencia.bind(catGerenciaController))
catGerenciaRouter.get('/', catGerenciaController.getCatGerencias.bind(catGerenciaController))
catGerenciaRouter.post('/delete', catGerenciaController.delete.bind(catGerenciaController))

export default catGerenciaRouter;
