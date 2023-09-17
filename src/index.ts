import app from '@/app'
import { API_URL, PORT } from '@/config'

app.listen(PORT, () => {
  console.log(`Server is running on  ${API_URL}:${PORT}`)
})
