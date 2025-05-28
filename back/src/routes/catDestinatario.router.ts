import CatDestinatarioController from '../controllers/catDestinatario.controller';
import { Router, Request, Response } from "express";

const catDestinatarioRouter = Router()
const catDestinatarioController = new CatDestinatarioController()

catDestinatarioRouter.post('/', catDestinatarioController.createCatDestinatario.bind(catDestinatarioController))
catDestinatarioRouter.get('/', catDestinatarioController.getCatDestinatarios.bind(catDestinatarioController))
catDestinatarioRouter.post('/delete', catDestinatarioController.delete.bind(catDestinatarioController))       

export default catDestinatarioRouter;
