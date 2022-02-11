import { Router } from 'express';

const router = Router()

router.get('/', async (req, res) => {
  try {
    await query('LOCK TABLES movies READ')
    const [results,] = await query('CALL getMovies(?)', [`%${req.query.q}%`])
    await query('UNLOCK TABLES')
    console.log(results)
    res.status(200).json({ results })
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, year, rank, genre1, genre2 } = req.body
    const { affectedRows, insertId } = await query(
      "INSERT INTO movies (name, year, `rank`, genre1, genre2) VALUES (?, ?, ?, ?, ?)",
      [name, year, rank, genre1, genre2]
    )
    res.status(200).json({ result: affectedRows === 1, insertId })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.all('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.query.id)
    if (!id) throw Error('Not a valid ID!')
    req.query.id = id
    next()
  } catch (err) {
    res.status(200).json({ result: false, err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const results = await query("SELECT * FROM movies WHERE id=?", [req.query.id])
    res.status(200).json({ result: results[0] })
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, year, rank, genre1, genre2 } = req.body
    const { changedRows } = await query(
      "UPDATE movies SET name=?, year=?, `rank`=?, genre1=?, genre2=? WHERE id=?",
      [name, year, rank, genre1, genre2, req.query.id]
    )
    res.status(200).json({ result: changedRows === 1 })
  } catch (err) {
    res.status(500).json({ result: false })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { affectedRows } = await query("DELETE FROM movies WHERE id=?", [req.query.id])
    res.status(200).json({ result: affectedRows === 1 })
  } catch (err) {
    res.status(500).json({ result: false })
  }
})

router.all('/:id', (req, res) => {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
})

export default router