import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { ApiEndpoints } from '@/constanst'
import { API_URL } from '@/config'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

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

export default app
