import app from '@/app'
import { API_URL, PORT } from '@/config'
import { sequelize } from '@/database'
import '@/database/create-tables'

async function main () {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false, alter: true })
    console.log('Connection has been established successfully.')
    app.listen(PORT, () => {
      console.log(`Server is running on  ${API_URL}:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
