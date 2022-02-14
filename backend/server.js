import express from 'express'
import cors from 'cors'
import router from './routes.js'

const app = express()

app.set('port', 3001)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))

// routes
app.use('/api/movies', router)

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
