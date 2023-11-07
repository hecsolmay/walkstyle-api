import * as infoCtrl from '@/controllers/info.controller'
import { Router } from 'express'
const router = Router()

router.get('/dashboard', infoCtrl.GetInfoDashboard)
router.get('/latest', infoCtrl.GetLatestInfo)
router.get('/count', infoCtrl.GetCountInfo)

export default router
