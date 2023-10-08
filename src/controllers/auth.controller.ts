import { validateLogin, validateRegister } from '@/schemas/auth'
import * as services from '@/service/user'
import { refreshTokenSign, tokenSign } from '@/utils/jwtoken'
import { mapUserAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function login (req: Request, res: Response) {
  try {
    const result = validateLogin(req.body)

    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const newUser = result.data
    const user = await services.getOne({ email: newUser.email })

    if (user === null) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const isCorrectPassword = await user.validPassword(newUser.password ?? '')

    if (!isCorrectPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = tokenSign(user.userId ?? '')

    const mappedUser = mapUserAttributes(user.toJSON())

    return res.status(200).json({ user: mappedUser, token })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function register (req: Request, res: Response) {
  try {
    const result = validateRegister(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newUser = result.data

    const existingUser = await services.getOne({ email: newUser.email })

    if (existingUser !== null) {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' })
    }

    const user = await services.create(newUser)

    const token = tokenSign(user.userId ?? '')
    const refreshToken = refreshTokenSign(user.userId ?? '')

    await user.update({ rememberToken: refreshToken })

    const userWithRole = await services.getById(user.userId ?? '')

    if (userWithRole === null) {
      return res.status(400).json({ message: 'Hubo un error al procesar su solicitud' })
    }

    const mappedUser = mapUserAttributes(userWithRole.toJSON())

    return res.status(201).json({ message: 'Registro exitoso', user: mappedUser, token })
  } catch (error) {
    console.error('Error al crear un usuario:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
