import { Router } from 'express'
import { query1 } from './lib/dbs.js'
import { v4 as uuidv4 } from 'uuid'

const query = query1
const router = Router()

router.get('/', async (req, res) => {
  try {
    const [results] = await query('CALL getMovies(?)', [`%${req.query.q}%`], 'READ')
    res.status(200).json({ results })
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, year, rank, genre1, genre2 } = req.body
    const movieId = uuidv4()
    await query("CALL insertMovie(?, ?, ?, ?, ?, ?, 0)", [movieId, name, year, rank, genre1, genre2], 'WRITE')
    res.status(200).json({ insertId: movieId })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [results] = await query("CALL getMovie(?)", [req.params.id], 'READ')
    res.status(200).json({ result: results[0] })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, year, rank, genre1, genre2 } = req.body
    const result = await query('CALL updateMovie(?, ?, ?, ?, ?, ?, 0)', [name, year, rank, genre1, genre2, req.params.id], 'WRITE')
    res.status(200).json({ result: result.constructor.name == 'OkPacket' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await query("CALL deleteMovie(?, 0)", [req.params.id], 'WRITE')
    res.status(200).json({ result: result.constructor.name == 'OkPacket' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.all('/:id', (req, res) => {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
})

export default router