import CatFolioFCFController from '../controllers/catFolioFCF.controller';
import { Router, Request, Response } from "express";

const catFolioFCFRouter = Router()
const catFolioFCFController = new CatFolioFCFController()

catFolioFCFRouter.post('/', catFolioFCFController.createCatFolioFCF.bind(catFolioFCFController))
catFolioFCFRouter.get('/existe', catFolioFCFController.getExisteCatFolioFCFs.bind(catFolioFCFController))
catFolioFCFRouter.get('/', catFolioFCFController.getCatFolioFCFs.bind(catFolioFCFController))
catFolioFCFRouter.post('/take', catFolioFCFController.take.bind(catFolioFCFController))
       
export default catFolioFCFRouter;
