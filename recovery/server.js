import express from 'express'
import recovery from './recovery.js'

const app = express()

app.set('port', 3002)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

setInterval(recovery, 10000)

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
