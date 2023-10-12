import * as categoriesCtrl from '@/controllers/category.controller'
import { uploadBannerAndImage } from '@/middlewares/create-image'
import { handleBannerAndImage } from '@/middlewares/upload'
import { Router } from 'express'

const router = Router()

router.get('/', categoriesCtrl.getCategories)
router.get('/all', categoriesCtrl.getCategoriesDeleted)
router.post('/', [handleBannerAndImage, uploadBannerAndImage], categoriesCtrl.createCategory)
router.get('/:categoryId', categoriesCtrl.getCategoryById)
router.delete('/:categoryId', categoriesCtrl.deleteCategory)
router.patch('/restore/:categoryId', categoriesCtrl.restoreCategory)

export default router
