import { parseRefreshToken, validateGoogleSignIn, validateLogin, validateRegister } from '@/schemas/auth'
import * as services from '@/service/user'
import { ZodValidationError, handleError } from '@/utils/errors'
import { refreshTokenSign, refreshTokenVerify, tokenSign } from '@/utils/jwtoken'
import { mapUserAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function login (req: Request, res: Response) {
  try {
    const result = validateLogin(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const newUser = result.data
    const user = await services.GetOne({ email: newUser.email })

    if (user === null) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const isCorrectPassword = await user.validPassword(newUser.password ?? '')

    if (!isCorrectPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' })
    }

    const token = tokenSign(user.userId ?? '')

    const mappedUser = mapUserAttributes(user.toJSON())

    return res.status(200).json({ user: mappedUser, token })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function googleSignIn (req: Request, res: Response) {
  try {
    const result = validateGoogleSignIn(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const { data } = result

    const existingUser = await services.GetOne({ email: data.email })

    let newUser = existingUser

    if (existingUser === null) {
      newUser = await services.Create({
        name: data.name,
        email: data.email,
        profileUrl: data.picture
      })

      const refreshToken = refreshTokenSign(newUser.userId ?? '')
      await newUser.update({ rememberToken: refreshToken })
    }

    const userWithRole = await services.GetById(newUser?.userId ?? '')

    if (userWithRole === null) {
      return res.status(400).json({ message: 'Hubo un error al procesar su solicitud' })
    }

    const mappedUser = mapUserAttributes(userWithRole.toJSON())

    const token = tokenSign(userWithRole.userId ?? '')

    return res.status(200).json({ message: 'Inicio de session exitoso', user: mappedUser, token })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function register (req: Request, res: Response) {
  try {
    const result = validateRegister(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }
    const newUser = result.data

    const existingUser = await services.GetOne({ email: newUser.email })

    if (existingUser !== null) {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' })
    }

    const user = await services.Create(newUser)

    const token = tokenSign(user.userId ?? '')
    const refreshToken = refreshTokenSign(user.userId ?? '')

    await user.update({ rememberToken: refreshToken })

    const userWithRole = await services.GetById(user.userId ?? '')

    if (userWithRole === null) {
      return res.status(400).json({ message: 'Hubo un error al procesar su solicitud' })
    }

    const mappedUser = mapUserAttributes(userWithRole.toJSON())

    return res.status(201).json({ message: 'Registro exitoso', user: mappedUser, token })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function refreshToken (req: Request, res: Response) {
  try {
    const result = parseRefreshToken(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const { refreshToken } = result.data

    const { userId } = refreshTokenVerify(refreshToken)

    const user = await services.GetById(userId)

    if (user === null) {
      return res.status(400).json({ message: 'Hubo un error al procesar su solicitud' })
    }

    if (user.rememberToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid Remember Token', error: 'Forbidden' })
    }

    const token = tokenSign(user.userId ?? '')

    return res.json({ token })
  } catch (error) {
    return handleError(error, res)
  }
}
