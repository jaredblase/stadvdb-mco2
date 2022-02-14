import { Router } from 'express'
import { db1, db2, db3, query1, query2, query3 } from './lib/dbs.js'
import { v4 as uuidv4 } from 'uuid'
import promiseHandler from './lib/promiseHandler.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [results] = await query1('CALL getMovies(?)', [`%${req.query.q}%`], 'READ')
    res.status(200).json({ results })
  } catch (err) {
    console.log(err)

    const tasks = [
      query2('CALL getMovies(?)', [`%${req.query.q}%`], 'READ'),
      query3('CALL getMovies(?)', [`%${req.query.q}%`], 'READ'),
    ]
    
    const results = await Promise.all(tasks.map(promiseHandler))
    if (results[0].error && results[1].error) {
      return res.status(500).json({ results: false })
    }

    if (results[0].error) {
      return res.status(200).json({ results: results[1].data[0] })
    }
    if (results[1].error) {
      return res.status(200).json({ results: results[0].data[0] })
    }

    return res.status(200).json({ results: results[0].data[0].concat(results[1].data[0]) })
  }
})

router.post('/', async (req, res) => {
  const { name, year, rank, genre1, genre2 } = req.body
  const movieId = uuidv4()
  
  try {
    await query1("CALL insertMovie(?, ?, ?, ?, ?, ?, 0)", [movieId, name, year, rank, genre1, genre2], 'WRITE')

    try {
      const query = (year < 1980) ? query2 : query3
      await query("CALL insertMovie(?, ?, ?, ?, ?, ?, 1)", [movieId, name, year, rank, genre1, genre2], 'WRITE')
    } catch (err) {
      console.log(err)
    } finally {
      res.status(200).json({ insertId: movieId })
    }
  } catch (err) {
    console.log(err)

    try {
      const query = (year < 1980) ? query2: query3
      await query("CALL insertMovie(?, ?, ?, ?, ?, ?, 0)", [movieId, name, year, rank, genre1, genre2], 'WRITE')
      res.status(200).json({ insertId: movieId })
    } catch (err) {
      console.log(err)
      res.status(500).json({ result: false })
    }
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [results] = await query1("CALL getMovie(?)", [req.params.id], 'READ')
    res.status(200).json({ result: results[0] })
  } catch (err) {
    console.log(err)

    const tasks = [
      query2('CALL getMovie(?)', [req.params.id], 'READ'),
      query3('CALL getMovie(?)', [req.params.id], 'READ')
    ]
    
    const results = await Promise.all(tasks.map(promiseHandler))

    if (results[0].error && results[1].error) {
      return res.status(500).json({ result: false })
    }

    if (results[0].error) {
      return res.status(200).json({ result: results[1].data[0].length ? results[1].data[0][0] : null })
    }
    if (results[1].error) {
      return res.status(200).json({ result: results[0].data[0].length ? results[0].data[0][0] : null })
    }

    return res.status(200).json({ result: results[0].data[0].concat(results[1].data[0])[0] })
  }
})

router.put('/:id', async (req, res) => {
  const { name, year, rank, genre1, genre2, oldYear } = req.body
  const movieId = req.params.id

  try {
    const result = await query1('CALL updateMovie(?, ?, ?, ?, ?, ?, 0)', [name, year, rank, genre1, genre2, movieId], 'WRITE')

    try {
      if (year < 1980 && oldYear < 1980) {
        await query2('CALL updateMovie(?, ?, ?, ?, ?, ?, 1)', [name, year, rank, genre1, genre2, movieId], 'WRITE')
      } else if (year >= 1980 && oldYear >= 1980) {
        await query3('CALL updateMovie(?, ?, ?, ?, ?, ?, 1)', [name, year, rank, genre1, genre2, movieId], 'WRITE')
      } else if (year < 1980) {
        await query3('CALL deleteMovie(?, 1)', [movieId], 'WRITE')
        await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [movieId, name, year, rank, genre1, genre2], 'WRITE')
      } else {
        await query2('CALL deleteMovie(?, 1)', [movieId], 'WRITE')
        await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [movieId, name, year, rank, genre1, genre2], 'WRITE')
      }
    } catch (err) {
      console.log(err)
    } finally {
      res.status(200).json({ result: result.constructor.name == 'OkPacket' })
    }
  } catch (err) {
    console.log(err)

    try {
      if (year < 1980 && oldYear < 1980) {
        await query2('CALL updateMovie(?, ?, ?, ?, ?, ?, 0)', [name, year, rank, genre1, genre2, movieId], 'WRITE')
      } else if (year >= 1980 && oldYear >= 1980) {
        await query3('CALL updateMovie(?, ?, ?, ?, ?, ?, 0)', [name, year, rank, genre1, genre2, movieId], 'WRITE')
      } else if (year < 1980) {
        const tasks = [
          db2.connect(),
          db3.connect()
        ]
        const results = await Promise.all(tasks.map(promiseHandler))

        if (!(results[0].error || results[1].error)) {
          await query3('CALL deleteMovie(?, 0)', [movieId], 'WRITE')
          await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 0)', [movieId, name, year, rank, genre1, genre2], 'WRITE')
        }
      } else {
        const tasks = [
          db2.connect(),
          db3.connect()
        ]
        const results = await Promise.all(tasks.map(promiseHandler))

        if (!(results[0].error || results[1].error)) {
          await query2('CALL deleteMovie(?, 0)', [movieId], 'WRITE')
          await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 0)', [movieId, name, year, rank, genre1, genre2], 'WRITE')
        }
      }

      res.status(200).json({ result: result.constructor.name == 'OkPacket' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ result: false })
    }
  }
})

router.delete('/:year/:id', async (req, res) => {
  const { year, id } = req.params;

  try {
    const result = await query1("CALL deleteMovie(?, 0)", [id], 'WRITE')

    try {
      const query = year < 1980 ? query2 : query3
      await query('CALL deleteMovie(?, 1)', [id], 'WRITE')
    } catch (err) {
      console.log(err)
    } finally {
      res.status(200).json({ result: result.constructor.name == 'OkPacket' })
    }
  } catch (err) {
    console.log(err)

    try {
      const query = year < 1980 ? query2 : query3
      await query('CALL deleteMovie(?, 0)', [id], 'WRITE')
      res.status(200).json({ result: result.constructor.name == 'OkPacket' })
    } catch (err) {
      res.status(500).json({ result: false })
    }
  }
})

router.all('/:id', (req, res) => {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
})

export default router