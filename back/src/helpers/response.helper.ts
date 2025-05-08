import {Request, Response} from 'express'
import logger from "../../lib/logger"
import IResponse from "../interfaces/response.interface"

export class ResponseHelper {
    static success<T>(res: Response, message: string, data: T, code = 200): Response {
      const response: IResponse = {
        ok: true,
        message,
        response: data,
        code,
      }

      return res.status(code).json(response)
    }
  
    static error(res: Response, message: string, error: any, code: number  = 500): Response {
      const response: IResponse = {
        ok: false,
        message,
        response: null,
        code,
      }

      logger.error(`[ResponseHelper]: ${error}`)
      return res.status(code).json(response)
    }
}