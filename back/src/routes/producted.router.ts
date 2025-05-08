
import { Router } from "express";
import { ProductedController } from "../controllers/producted.controller";
import Authenticate from "../middleware/auth.middleware";

const productedRouter = Router()
const productCtrl = new ProductedController()
const checkToken = new Authenticate()

productedRouter.get('/',checkToken.authentication ,productCtrl.prueba.bind(productCtrl))

export default productedRouter