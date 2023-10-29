import { Router } from 'express'
import * as saleCtrl from '@/controllers/sales.controller'
import { verifyAccessToken } from '@/middlewares/token'
import { adminRoleValidator, existedUserValidator } from '@/middlewares/auth'

const router = Router()

const middleWares = [verifyAccessToken, existedUserValidator]
const adminMiddlewares = [...middleWares, adminRoleValidator]

router.get('/', [...adminMiddlewares], saleCtrl.getSales)

router.get('/:saleId', [...adminMiddlewares], saleCtrl.getSaleById)

router.post('/', [...middleWares], saleCtrl.createSale)

export default router
