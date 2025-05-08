import express from 'express'
import authRouter from './auth.router'
import productedRouter from './producted.router'

const routers = express()

routers.use('/auth', authRouter)
routers.use('/producted', productedRouter)

export default routers