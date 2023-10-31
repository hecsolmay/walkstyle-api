import { Router } from 'express'
import * as genderCtrl from '@/controllers/gender.controller'

const router = Router()

router.get('/:gender/products', genderCtrl.GetProductsByGender)

export default router
