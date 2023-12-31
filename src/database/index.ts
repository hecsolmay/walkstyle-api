import { Sequelize } from 'sequelize'
import {
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_USER,
  DATABASE_PORT
} from '@/config'

export const sequelize = new Sequelize({
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
  username: DATABASE_USER,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'production' ? false : console.log
})
