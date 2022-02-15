import { db1, db2, db3, query1, query2, query3, getLastLog, getFinishedLogs } from "./lib/dbs.js";

export default async function recovery(config) {
  console.log(config)
  const dbs = [db1, db2, db3]
  const queries = [query1, query2, query3]

  // transaction failure
  for (let i = 0; i < 3; i++) {
    const db = dbs[i]
    const query = queries[i]

    try {
      const result = await getLastLog(db)
      if (result.status === 'started') {
        switch (result.action) {
          case 'update':
            await query('CALL updateMovie(?, ?, ?, ?, ?, ?, 2)', [result.old_name, result.old_year, result.old_rank, 
              result.old_genre1, result.old_genre2, result.movie_id], 'WRITE')
            break
          case 'insert':
            await query('CALL deleteMovie(?, 2)', [result.movie_id], 'WRITE')
            break
          case 'delete':
            await query('CALL insertMovie(?, ?, ?, ?, ?, ?, 2)', [result.movie_id, result.old_name, result.old_year,
              result.old_rank, result.old_genre1, result.old_genre2], 'WRITE')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  // replication
  // replicate node1 => node2
  try {
    const logs = await getFinishedLogs(db2, db1)
    logs.forEach(async (log) => {
      switch (log.action) {
        case 'update':
          if (log.new_year < 1980 && log.old_year < 1980) {
            await query2('CALL updateMovie(?, ?, ?, ?, ?, ?, 1', [log.new_name, log.new_year, log.new_rank,
              log.new_genre1, log.new_genre2, log.movie_id], 'WRITE')
          } else if (log.new_year < 1980) {
            await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
              log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          } else if (log.old_year < 1980) {
            await query2('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
          }
          break
        case 'insert':
          if (log.new_year < 1980) {
            await query2('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
              log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          }
          break
        case 'delete':
          if (log.old_year < 1980) {
            await query2('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
          }
      }
    })
  } catch (err) {
    console.log(err)
  }

  // replicate node1 => node3
  try {
    const logs = await getFinishedLogs(db3, db1)

    logs.forEach(async (log) => {
      switch (log.action) {
        case 'update':
          if (log.new_year >= 1980 && log.old_year >= 1980) {
            await query3('CALL updateMovie(?, ?, ?, ?, ?, ?, 1', [log.new_name, log.new_year, log.new_rank,
              log.new_genre1, log.new_genre2, log.movie_id], 'WRITE')
          } else if (log.new_year >= 1980) {
            await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
              log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          } else if (log.old_year >= 1980) {
            await query3('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
          }
          break
        case 'insert':
          if (log.new_year >= 1980) {
            await query3('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
              log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          }
          break
        case 'delete':
          if (log.old_year >= 1980) {
            await query3('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
          }
      }
    })
  } catch (err) {
    console.log(err)
  }

  // replicate node2 => node1
  try {
    const logs = await getFinishedLogs(db1, db2)
    logs.forEach(async (log) => {
      switch (log.action) {
        case 'update':
          await query1('CALL updateMovie(?, ?, ?, ?, ?, ?, 1)', [log.new_name, log.new_year, log.new_rank,
            log.new_genre1, log.new_genre2, log.movie_id], 'WRITE')
          break
        case 'insert':
          await query1('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
            log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          break
        case 'delete':
          await query1('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
      }
    })
  } catch (err) {
    console.log(err)
  }

  // replicate node3 => node1
  try {
    const logs = await getFinishedLogs(db1, db3)
    logs.forEach(async (log) => {
      switch (log.action) {
        case 'update':
          await query1('CALL updateMovie(?, ?, ?, ?, ?, ?, 1)', [log.new_name, log.new_year, log.new_rank,
            log.new_genre1, log.new_genre2, log.movie_id], 'WRITE')
          break
        case 'insert':
          await query1('CALL insertMovie(?, ?, ?, ?, ?, ?, 1)', [log.movie_id, log.new_name, log.new_year,
            log.new_rank, log.new_genre1, log.new_genre2], 'WRITE')
          break
        case 'delete':
          await query1('CALL deleteMovie(?, 1)', [log.movie_id], 'WRITE')
      }
    })
  } catch (err) {
    console.log(err)
  }
}