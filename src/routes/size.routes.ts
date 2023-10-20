import * as sizeCtrl from '@/controllers/size.controller'
import { Router } from 'express'

const router = Router()

router.post('/', sizeCtrl.createSize)
router.put('/:sizeId', sizeCtrl.updateSizeById)
router.delete('/:sizeId', sizeCtrl.deleteSizeById)
router.patch('/:sizeId', sizeCtrl.restoreSizeById)

export default router
