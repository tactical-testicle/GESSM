import CatDocumentalController from '../controllers/catDocumental.controller';
import { Router, Request, Response } from "express";

const catDocumentalRouter = Router()
const catDocumentalController = new CatDocumentalController()

catDocumentalRouter.post('/', catDocumentalController.createCatDocumental.bind(catDocumentalController))       
catDocumentalRouter.get('/', catDocumentalController.getCatDocumentals.bind(catDocumentalController))
catDocumentalRouter.post('/delete', catDocumentalController.delete.bind(catDocumentalController))
       
export default catDocumentalRouter;
