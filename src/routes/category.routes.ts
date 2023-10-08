import * as categoriesCtrl from '@/controllers/category.controller'
import { uploadBannerAndImage } from '@/middlewares/create-image'
import { handleBannerAndImage } from '@/middlewares/upload'
import { Router } from 'express'

const router = Router()

router.post('/', [handleBannerAndImage, uploadBannerAndImage], categoriesCtrl.createCategory)
router.put('/', [handleBannerAndImage, uploadBannerAndImage], categoriesCtrl.createCategory)

export default router
