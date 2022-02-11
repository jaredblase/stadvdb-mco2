import express from 'express'
import cors from 'cors'
import router from './routes.js'

const app1 = express()
const app2 = express()

app1.set('port', 3001)
app2.set('port', 3002)

const servers = [app1, app2]

servers.forEach(app => {
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors({ origin: 'http://localhost:3000' }))

  // routes
  app.use('/api/movie', router)
})

servers.forEach(app => {
  app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
})
