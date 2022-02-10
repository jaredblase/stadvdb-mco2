import { query } from '../../../lib/db'

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const results = await query('SELECT * FROM movies WHERE name LIKE ?', [`%${req.query.q}%`])
        res.status(200).json({ results })
      } catch (err) {
        console.log(err)
      }
      break

    case 'POST':
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
      break
  }
}
