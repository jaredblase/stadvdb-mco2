import mysql from 'serverless-mysql'
import 'dotenv/config'

const createDb = (host) => mysql({
  config: {
    host,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  }
})

function query(db) {
  return async (q, values, mode) => {
    try {
      await db.query('LOCK TABLES movies ' + mode)
      const results = await db.query(q, values)
      await db.query('UNLOCK TABLES')
      await db.end()
      return results
    } catch (e) {
      try {
        await db.query('UNLOCK TABLES')
        await db.end()
      } catch (e) {
        throw Error(e.message)
      }
      throw Error(e.message)
    }
  }
}

export const db1 = createDb(process.env.DB_HOST1)
export const db2 = createDb(process.env.DB_HOST2)
export const db3 = createDb(process.env.DB_HOST3)

export const query1 = async (q, values, mode) => await query(db1)(q, values, mode)
export const query2 = async (q, values, mode) => await query(db2)(q, values, mode)
export const query3 = async (q, values, mode) => await query(db3)(q, values, mode)
