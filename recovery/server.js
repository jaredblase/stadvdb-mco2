import express from 'express'
import cors from 'cors'

const app = express()

app.set('port', 3003)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))

// routes
// app.use('/api/recovery', router)

setInverval(() => {
    console.log('hi')
}, 5000)

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))