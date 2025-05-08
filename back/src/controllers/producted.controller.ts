import { Request, Response } from 'express'
import { ResponseHelper } from "../helpers/response.helper";


export class ProductedController {
    async prueba(req: Request, res: Response):Promise<any>{
        return ResponseHelper.success(res,'Success view', null, 200)
    }
}