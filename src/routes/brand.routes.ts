import * as brandsCtrl from '@/controllers/brand.controller'
import { uploadBannerAndImage } from '@/middlewares/create-image'
import { handleBannerAndImage } from '@/middlewares/upload'
import { Router } from 'express'

const router = Router()

router.get('/', brandsCtrl.getBrands)
router.get('/all', brandsCtrl.getbrandsDeleted)
router.get('/:brandId', brandsCtrl.getBrandById)
router.get('/:brandId/products', brandsCtrl.getProductsByBrand)
router.delete('/:brandId', brandsCtrl.deleteBrand)
router.patch('/restore/:brandId', brandsCtrl.restoreBrand)
router.post('/', [handleBannerAndImage, uploadBannerAndImage], brandsCtrl.createBrand)
router.put('/:brandId', [handleBannerAndImage, uploadBannerAndImage], brandsCtrl.updateBrand)

export default router
