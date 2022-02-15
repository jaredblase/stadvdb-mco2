import { Router } from 'express'
import { db2, db3, query1, query2, query3 } from './lib/dbs.js'
import { v4 as uuidv4 } from 'uuid'
import promiseHandler from './lib/promiseHandler.js'

function getConfig(req) {
  return [req.app.get('node1'), req.app.get('node2'), req.app.get('node3')]
}
const error1 = Error('Node 1 is down')
const error2 = Error('Node 2 is down')
const error3 = Error('Node 3 is down')

const router = Router()

router.get('/', async (req, res) => {
  const config = getConfig(req)

  try {
    if (!config[0]) {
      throw error1
    }

    const [results] = await query1('CALL getMovies(?, 0)', [`%${req.query.q}%`], 'READ')
    res.status(200).json({ results })
  } catch (err) {
    console.log(err)

    const tasks = [
      query2('CALL getMovies(?, 0)', [`%${req.query.q}%`], 'READ'),
      query3('CALL getMovies(?, 0)', [`%${req.query.q}%`], 'READ'),
    ]
    
    const results = await Promise.all(tasks.map(promiseHandler))
    if (!config[1]) {
      results[0].error = error2
    }
    if (!config[2]) {
      results[1].error = error3
    }

    if (results[0].error && results[1].error) {
      return res.status(500).json({ results: false })
    }

    if (results[0].error) {
      return res.status(200).json({ results: results[1].data[0] })
    }
    if (results[1].error) {
      return res.status(200).json({ results: results[0].data[0] })
    }

    const finalResults = results[0].data[0].concat(results[1].data[0])
    finalResults.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    })
    return res.status(200).json({ results: finalResults })
  }
})

router.post('/', async (req, res) => {
  const config = getConfig(req)
  const fail = req.app.get('crashTransactions')

  const { name, year, rank, genre1, genre2 } = req.body
  const movieId = uuidv4()
  
  try {
    if (!config[0]) {
      throw error1;
    }

    await query1("CALL insertMovie(?, ?, ?, ?, ?, ?, 0, ?)", [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')

    try {
      let check, error, query
      if (year < 1980) {
        check = config[1]
        error = error2
        query = query2
      } else {
        check = config[2]
        error = error3
        query = query3
      }

      if (!check) {
        throw error
      }

      await query("CALL insertMovie(?, ?, ?, ?, ?, ?, 1, ?)", [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
    } catch (err) {
      console.log(err)
    } finally {
      res.status(200).json({ insertId: movieId })
    }
  } catch (err) {
    console.log(err)

    try {
      let check, error, query
      if (year < 1980) {
        check = config[1]
        error = error2
        query = query2
      } else {
        check = config[2]
        error = error3
        query = query3
      }
      if (!check) {
        throw error
      }

      await query("CALL insertMovie(?, ?, ?, ?, ?, ?, 0, ?)", [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
      res.status(200).json({ insertId: movieId })
    } catch (err) {
      console.log(err)
      res.status(500).json({ result: false })
    }
  }
})

router.get('/:id', async (req, res) => {
  const config = getConfig(req)

  try {
    if (!config[0]) {
      throw error1
    }

    const [results] = await query1("CALL getMovie(?, 0)", [req.params.id], 'READ')
    res.status(200).json({ result: results[0] })
  } catch (err) {
    console.log(err)

    const tasks = [
      query2('CALL getMovie(?, 0)', [req.params.id], 'READ'),
      query3('CALL getMovie(?, 0)', [req.params.id], 'READ')
    ]
    
    const results = await Promise.all(tasks.map(promiseHandler))
    if (!config[1]) {
      results[0].error = error2
    }
    if (!config[2]) {
      results[1].error = error3
    }

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
  const config = getConfig(req)
  const fail = req.app.get('crashTransactions')

  const { name, year, rank, genre1, genre2, oldYear } = req.body
  const movieId = req.params.id

  try {
    if (!config[0]) {
      throw error1
    }

    const result = await query1('CALL updateMovie(?, ?, ?, ?, ?, ?, 0, ?)', [name, year, rank, genre1, genre2, movieId, fail], 'WRITE')

    try {
      if (year < 1980 && oldYear < 1980) {
        if (!config[1]) {
          throw error2
        }
        await query2('CALL updateMovie(?, ?, ?, ?, ?, ?, 1, ?)', [name, year, rank, genre1, genre2, movieId, fail], 'WRITE')
      } else if (year >= 1980 && oldYear >= 1980) {
        if (!config[2]) {
          throw error3
        }
        await query3('CALL updateMovie(?, ?, ?, ?, ?, ?, 1, ?)', [name, year, rank, genre1, genre2, movieId, fail], 'WRITE')
      } else if (year < 1980) {
        if (!config[1]) {
          throw error2
        }
        if (!config[2]) {
          throw error3
        }

        await query3('CALL deleteMovie(?, 1, ?)', [movieId, fail], 'WRITE')
        await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 1, ?)', [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
      } else {
        if (!config[1]) {
          throw error2
        }
        if (!config[2]) {
          throw error3
        }

        await query2('CALL deleteMovie(?, 1, ?)', [movieId, fail], 'WRITE')
        await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 1, ?)', [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
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
        if (!config[1]) {
          throw error2
        }
        await query2('CALL updateMovie(?, ?, ?, ?, ?, ?, 0, ?)', [name, year, rank, genre1, genre2, movieId, fail], 'WRITE')
      } else if (year >= 1980 && oldYear >= 1980) {
        if (!config[2]) {
          throw error3
        }
        await query3('CALL updateMovie(?, ?, ?, ?, ?, ?, 0, ?)', [name, year, rank, genre1, genre2, movieId, fail], 'WRITE')
      } else if (year < 1980) {
        if (!config[1]) {
          throw error2
        }
        if (!config[2]) {
          throw error3
        }

        const tasks = [
          db2.connect(),
          db3.connect()
        ]
        const results = await Promise.all(tasks.map(promiseHandler))

        if (!(results[0].error || results[1].error)) {
          await query3('CALL deleteMovie(?, 0, ?)', [movieId, fail], 'WRITE')
          await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 0, ?)', [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
        }
      } else {
        if (!config[1]) {
          throw error2
        }
        if (!config[2]) {
          throw error3
        }

        const tasks = [
          db2.connect(),
          db3.connect()
        ]
        const results = await Promise.all(tasks.map(promiseHandler))

        if (!(results[0].error || results[1].error)) {
          await query2('CALL deleteMovie(?, 0, ?)', [movieId, fail], 'WRITE')
          await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 0, ?)', [movieId, name, year, rank, genre1, genre2, fail], 'WRITE')
        }
      }

      res.status(200).json({ result: true })
    } catch (err) {
      console.log(err)
      res.status(500).json({ result: false })
    }
  }
})

router.delete('/:year/:id', async (req, res) => {
  const config = getConfig(req)
  const fail = req.app.get('crashTransactions')

  const { year, id } = req.params;

  try {
    if (!config[0]) {
      throw error1
    }
    const result = await query1("CALL deleteMovie(?, 0, ?)", [id, fail], 'WRITE')

    try {
      let check, error, query
      if (year < 1980) {
        check = config[1]
        error = error2
        query = query2
      } else {
        check = config[2]
        error = error3
        query = query3
      }

      if (!check) {
        throw error
      }

      await query('CALL deleteMovie(?, 1, ?)', [id, fail], 'WRITE')
    } catch (err) {
      console.log(err)
    } finally {
      res.status(200).json({ result: result.constructor.name == 'OkPacket' })
    }
  } catch (err) {
    console.log(err)

    try {
      let check, error, query
      if (year < 1980) {
        check = config[1]
        error = error2
        query = query2
      } else {
        check = config[2]
        error = error3
        query = query3
      }

      if (!check) {
        throw error
      }

      await query('CALL deleteMovie(?, 0, ?)', [id, fail], 'WRITE')
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