import CatPuestoController from '../controllers/catPuesto.controller';
import { Router, Request, Response } from "express";

const catPuestoRouter = Router()
const catPuestoController = new CatPuestoController()

catPuestoRouter.post('/', catPuestoController.createCatPuesto.bind(catPuestoController))
catPuestoRouter.get('/', catPuestoController.getCatPuestos.bind(catPuestoController))
catPuestoRouter.post('/delete', catPuestoController.delete.bind(catPuestoController))

export default catPuestoRouter;
