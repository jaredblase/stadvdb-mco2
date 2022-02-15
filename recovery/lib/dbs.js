import mysql from 'serverless-mysql'
import 'dotenv/config'

const createDb = (host) => mysql({
  config: {
    host,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
  }
})

function query(db) {
  return async (q, values, mode) => {
    try {
      await db.query('LOCK TABLES movies ' + mode + ', movies_log WRITE')
      const results = await db.query(q, values)
      await db.query('UNLOCK TABLES')
      await db.end()
      return results
    } catch (e) {
      console.log(err)
    }
  }
}

export async function getLastLog(db) {
  try {
    await db.query('LOCK TABLES movies_log READ')
    const [result] = await db.query('SELECT * FROM movies_log ORDER BY log_id DESC LIMIT 1')
    await db.query('UNLOCK TABLES')
    return result
  } catch (e) {
    throw Error(e.message)
  }
}

export async function getFinishedLogs(dbTo, dbFrom) {
  try {
    await dbTo.query('LOCK TABLES movies_log READ')
    await dbFrom.query('LOCK TABLES movies_log READ')
    const [result] = await dbTo.query('SELECT * FROM movies_log WHERE status != "started" ORDER BY log_id DESC LIMIT 1')
    const results = await dbFrom.query('SELECT * FROM movies_log WHERE status = "done" AND changedate > (?)', [result.changedate])
    await dbTo.query('UNLOCK TABLES')
    await dbFrom.query('UNLOCK TABLES')

    return results
  } catch (e) {
    throw Error(e.message)
  }
}

export const db1 = createDb(process.env.DB_HOST1)
export const db2 = createDb(process.env.DB_HOST2)
export const db3 = createDb(process.env.DB_HOST3)

export const query1 = async (q, values, mode) => await query(db1)(q, values, mode)
export const query2 = async (q, values, mode) => await query(db2)(q, values, mode)
export const query3 = async (q, values, mode) => await query(db3)(q, values, mode)
