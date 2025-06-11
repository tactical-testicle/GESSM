import express from 'express'
import authRouter from './auth.router'
import userRouter from './user.router'
import folioRouter from './folio.router'
import catFolioRouter from './catFolio.router'
import catGerenciaRouter from './catGerencia.router'
import catSubgerenciaRouter from './catSubgerencia.router'
import catSuperintendenciaRouter from './catSuperintendencia.router'
import catPuestoRouter from './catPuesto.router'
import catDocumentalRouter from './catDocumental.router'
import catDestinatarioRouter from './catDestinatario.router'
import catRemitenteRouter from './catRemitente.router'
import cargaMasivaRouter from './cargaMasiva.router'
import catFolioFCFRouter from './catFolioFCF.router'
import catIncidenciaRouter from './catIncidencia.router'
import estadoFuerzaRouter from './estadoFuerza.router'

const routers = express()

routers.use('/user',userRouter)
routers.use('/folio', folioRouter)
routers.use('/auth', authRouter)
routers.use('/estadoFuerza', estadoFuerzaRouter)

// catalogos
routers.use('/catFolio', catFolioRouter)
routers.use('/catGerencia', catGerenciaRouter)
routers.use('/catSubgerencia', catSubgerenciaRouter)
routers.use('/catSuperintendencia', catSuperintendenciaRouter)
routers.use('/catPuesto', catPuestoRouter)
routers.use('/catDestinatario', catDestinatarioRouter)
routers.use('/catRemitente', catRemitenteRouter)
routers.use('/catDocumental', catDocumentalRouter)
routers.use('/catFolioFCF', catFolioFCFRouter)
routers.use('/catIncidencia', catIncidenciaRouter)


// carga
routers.use('/cargaMasiva', cargaMasivaRouter)

export default routers