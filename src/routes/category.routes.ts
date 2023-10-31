import * as categoriesCtrl from '@/controllers/category.controller'
import { uploadBannerAndImage } from '@/middlewares/create-image'
import { handleBannerAndImage } from '@/middlewares/upload'
import { Router } from 'express'

const router = Router()

router.get('/', categoriesCtrl.getCategories)
router.get('/all', categoriesCtrl.getCategoriesDeleted)
router.post('/', [handleBannerAndImage, uploadBannerAndImage], categoriesCtrl.createCategory)
router.put('/:categoryId', [handleBannerAndImage, uploadBannerAndImage], categoriesCtrl.updateCategory)
router.get('/:categoryId', categoriesCtrl.getCategoryById)
router.get('/:categoryId/products', categoriesCtrl.getProductsByCategory)
router.delete('/:categoryId', categoriesCtrl.deleteCategory)
router.patch('/restore/:categoryId', categoriesCtrl.restoreCategory)

export default router
