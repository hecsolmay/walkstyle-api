import app from '@/app'
import { PORT } from '@/config'
import { sequelize } from '@/database'
import '@/database/create-tables'
import { createRoles, createGenders } from '@/utils/inicial-setup'

async function main () {
  try {
    console.log('Connecting to the database...')
    await sequelize.authenticate()
    await sequelize.sync({ force: false, alter: true })
    console.log('Connection has been established successfully.')
    await Promise.all([createRoles(), createGenders()])
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}

(async () => {
  try {
    await main()
    console.log(`Aplication Port: ${PORT}`)
    app.listen(PORT, () => {
      console.log(`Server is running on  Port ${PORT}`)
    })
  } catch (error) {

  }
})()
