import CatRemitenteController from '../controllers/catRemitente.controller';
import { Router, Request, Response } from "express";

const catRemitenteRouter = Router()
const catRemitenteController = new CatRemitenteController()

catRemitenteRouter.post('/', catRemitenteController.createCatRemitente.bind(catRemitenteController))
catRemitenteRouter.get('/', catRemitenteController.getCatRemitentes.bind(catRemitenteController))
catRemitenteRouter.post('/delete', catRemitenteController.delete.bind(catRemitenteController))

export default catRemitenteRouter;
