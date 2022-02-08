import { query } from '../../../lib/db'

export default async function handler(req, res) {

  try {
    const results = await query('SELECT * FROM movies WHERE name LIKE ?', [`%${req.query.q}%`])
    res.status(200).json({ results })
  } catch (err) {
    console.log(err)
  }
}
