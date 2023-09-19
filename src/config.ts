import 'dotenv/config'

export const PORT = Number(process.env.PORT ?? 3000)
export const API_URL = process.env.API_URL
export const DATABASE_NAME = process.env.DATABASE_NAME
export const DATABASE_HOST = process.env.DATABASE_HOST
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
export const DATABASE_USER = process.env.DATABASE_USER
export const DATABASE_PORT = Number(process.env.DATABASE_PORT ?? 3306)
