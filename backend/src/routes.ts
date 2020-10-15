import { Router } from 'express'
import multer from 'multer'

import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'

// MVC
// Model
// Views
// Controllers

const routes = Router();
const upload = multer(uploadConfig)

routes.get('/guild', OrphanagesController.index)
routes.get('/guild/:id', OrphanagesController.show)
routes.post('/guild', upload.array('images'), OrphanagesController.create)


export default routes