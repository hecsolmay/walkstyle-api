import { EXPIRES, REFRESHEXPIRES, REFRESHSECRET, SECRET } from '@/config'
import { sign, verify } from 'jsonwebtoken'

interface TokenVerifyResponse {
  userId: string
}

export const tokenSign = (userId: string) => sign({ userId }, SECRET, { expiresIn: EXPIRES })
export const tokenVerify = (token: string) => verify(token, SECRET) as TokenVerifyResponse
export const refreshTokenSign = (userId: string) => sign({ userId }, REFRESHSECRET, { expiresIn: REFRESHEXPIRES })
export const refreshTokenVerify = (token: string) => verify(token, REFRESHSECRET) as TokenVerifyResponse
