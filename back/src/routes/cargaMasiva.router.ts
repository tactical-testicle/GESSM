import CargaMasivaController from '../controllers/cargaMasiva.controller';
import { Router, Request, Response } from "express";
import fileUpload from 'express-fileupload';

const cargaMasivaRouter = Router()
const cargaMasivaController = new CargaMasivaController()

cargaMasivaRouter.post('/', cargaMasivaController.createCargaMasiva.bind(cargaMasivaController))

export default cargaMasivaRouter;