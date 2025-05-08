
import { Request, Response, NextFunction} from 'express'
import { ResponseHelper } from '../helpers/response.helper'
import logger from '../../lib/logger'
import { verify } from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
    user_client?: any;
  }

export default class Authenticate {
    async authentication(req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<any>{
        try{
            if(!req.headers.authorization){
                return ResponseHelper.error(res,'Empty token', null, 400)
            }
            const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ","") : ''
            
            verify(token, String(process.env.JWT_SECRET), (error: any, decoded: any)=> { 
                if(error) return ResponseHelper.error(res,'Token expired', error, 301)
                    const {user} = decoded
                    req.user_client = user;
                    next()
            })
            

        }catch(error){
            logger.error(`[Error/middleware]: ${error}`)
            return ResponseHelper.error(res,'Error ocurred',null, 500)
        }
    }

}