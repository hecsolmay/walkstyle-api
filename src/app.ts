import { API_URL } from '@/config'
import { ApiEndpoints } from '@/constanst'
import authRoutes from '@/routes/auth.routes'
import categoryRoutes from '@/routes/category.routes'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'node:path'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '../public')))

app.use((_req, res, next) => {
  res.removeHeader('X-Powered-By')
  next()
})

app.get('/', (_req, res) => {
  res.json({
    message: `Welcome to the Walkstyle API see our docs at ${API_URL}/api/docs`,
    endponts: ApiEndpoints.map(endpoint => `${API_URL}${endpoint}`)
  })
})

app.get('/api', (_req, res) => {
  res.send('Api docs')
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)

app.get('*', (_req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/not-found.html'))
})

export default app
