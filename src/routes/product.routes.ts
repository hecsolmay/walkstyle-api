import * as productCtrl from '@/controllers/product.controller'
import { handleMultipleFiles } from '@/middlewares/upload'
import { validateProduct } from '@/middlewares/validate'
import { Router } from 'express'

const router = Router()

router.get('/', productCtrl.getProducts)
router.post('/', [handleMultipleFiles, validateProduct], productCtrl.createProduct)
router.get('/all', productCtrl.getProductsDeleted)
router.get('/:productId', productCtrl.getProductById)
router.delete('/:productId', productCtrl.deleteProduct)
router.patch('/:productId', productCtrl.restoreProduct)

export default router
