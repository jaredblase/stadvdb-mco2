import express from 'express'
import replicate from './replicate.js'

const app = express()

app.set('port', 3002)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

setInterval(replicate, 1000)

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
