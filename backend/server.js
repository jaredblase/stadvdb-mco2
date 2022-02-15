import express from 'express'
import cors from 'cors'
import router from './routes.js'
import report from './report.js'
import 'dotenv/config'

const app = express()

app.set('port', process.env.PORT || 3001)
app.set('node1', true)
app.set('node2', true)
app.set('node3', true)
app.set('crashTransactions', 0)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: process.env.NODE_ENV == 'production' ? process.env.PRODUCTION_DOMAIN : 'http://localhost:3000' }))

// routes
app.use('/api/movies', router)
app.get('/api/report', report)

app.get('/config', (req, res) => {
  res.status(200).json({
    node1: app.get('node1'),
    node2: app.get('node2'),
    node3: app.get('node3'),
    crashTransactions: app.get('crashTransactions')
  })
})

app.post('/config', (req, res) => {
  const { node1, node2, node3, crashTransactions } = req.body
  app.set('node1', node1)
  app.set('node2', node2)
  app.set('node3', node3)
  app.set('crashTransactions', crashTransactions ? 1 : 0)
  res.status(200).json({ result: true })
})

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`))
