import * as productCtrl from '@/controllers/product.controller'
import { uploadMultipleImages } from '@/middlewares/create-image'
import { handleMultipleFiles } from '@/middlewares/upload'
import { validatePartialProduct, validateProduct } from '@/middlewares/validate'
import { Router } from 'express'

const router = Router()

router.get('/', productCtrl.getProducts)
router.post('/', [handleMultipleFiles, validateProduct, uploadMultipleImages], productCtrl.createProduct)
router.get('/all', productCtrl.getProductsDeleted)
router.get('/:productId', productCtrl.getProductById)
router.put('/:productId', [handleMultipleFiles, validatePartialProduct, uploadMultipleImages], productCtrl.updateProduct)
router.delete('/:productId', productCtrl.deleteProduct)
router.patch('/:productId', productCtrl.restoreProduct)

export default router
