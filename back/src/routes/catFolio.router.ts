import CatFolioController from '../controllers/catFolio.controller';
import { Router, Request, Response } from "express";

const catFolioRouter = Router()
const catFolioController = new CatFolioController()

catFolioRouter.post('/', catFolioController.createCatFolio.bind(catFolioController))
catFolioRouter.get('/', catFolioController.getCatFolios.bind(catFolioController))

export default catFolioRouter;
