import express from 'express'
import cors from 'cors'
import router from './routes.js'
import 'dotenv/config'

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: process.env.NODE_ENV == 'production' ? process.env.PRODUCTION_DOMAIN : 'http://localhost:3000' }))

// routes
app.use('/api/movies', router)

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
