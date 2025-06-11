import ForceStatusController from '../controllers/forceStatus.controller';
import { Router, Request, Response } from "express";

const forceStatusRouter = Router()
const forceStatusController = new ForceStatusController()

forceStatusRouter.post('/', forceStatusController.createForceStatusRecord.bind(forceStatusController))
forceStatusRouter.get('/getCountByDay', forceStatusController.getCountEstadoByDay.bind(forceStatusController))
forceStatusRouter.get('/getList', forceStatusController.getListEstado.bind(forceStatusController))
forceStatusRouter.get('/getListByDay', forceStatusController.getListEstadoByDay.bind(forceStatusController))



export default forceStatusRouter;
