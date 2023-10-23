import * as userCtrl from '@/controllers/user.controller'
import { Router } from 'express'

const router = Router()
//
router.get('/', userCtrl.getUsers)
router.get('/all', userCtrl.getusersDeleted)
router.get('/:userId', userCtrl.getUserById)
router.delete('/:userId', userCtrl.deleteUser)
router.patch('/restore/:userId', userCtrl.restoreUser)
router.patch('/:userId/role', userCtrl.changeRole)
router.patch('/:userId/restore-password', userCtrl.restorePassword)
router.put('/:userId', userCtrl.updateUserById)

export default router
