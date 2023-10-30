import { Router } from 'express'
import * as saleCtrl from '@/controllers/sales.controller'
// import { verifyAccessToken } from '@/middlewares/token'
// import { adminRoleValidator, existedUserValidator } from '@/middlewares/auth'

const router = Router()

// const middleWares = [verifyAccessToken, existedUserValidator]
// const adminMiddlewares = [...middleWares, adminRoleValidator]

router.get('/', saleCtrl.getSales)

router.get('/:saleId', saleCtrl.getSaleById)

router.post('/', saleCtrl.createSale)

export default router
