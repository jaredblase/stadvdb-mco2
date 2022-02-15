import express from 'express'
import recovery from './recovery.js'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.set('port', process.env.PORT || 3002)
app.set('node1', true)
app.set('node2', true)
app.set('node3', true)

app.use(cors({
  origin: process.env.NODE_ENV == 'production' ? process.env.PRODUCTION_DOMAIN : 'http://localhost:3000'
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

setInterval(() => recovery([app.get('node1'), app.get('node2'), app.get('node3')]), 10000)

app.get('/config', (req, res) => {
  res.status(200).json({
    node1: app.get('node1'),
    node2: app.get('node2'),
    node3: app.get('node3')
  })
})

app.post('/config', (req, res) => {
  const { node1, node2, node3 } = req.body
  app.set('node1', node1)
  app.set('node2', node2)
  app.set('node3', node3)
  res.status(200).json({ result: true })
})

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
