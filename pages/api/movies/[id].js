import { query } from '../../../lib/db'

export default async function userHandler(req, res) {
  const { method } = req
  const id = parseInt(req.query.id)

  switch (method) {
    case 'GET':
      try {
        const result = await query("SELECT * FROM movies WHERE id=?", [id])
        res.status(200).json({ result: result[0] })
      } catch (err) {
        console.log(err)
        res.status(500).json({ result: false })
      }
      break

    case 'PUT':
      try {
        const { name, year, rank, genre1, genre2 } = req.body
        const { changedRows } = await query(
          "UPDATE movies SET name=?, year=?, `rank`=?, genre1=?, genre2=? WHERE id=?",
          [name, year, rank, genre1, genre2, id]
        )
        res.status(200).json({ result: changedRows === 1 })
      } catch (err) {
        res.status(500).json({ result: false })
      }
      break

    case 'DELETE':
      try {
        const { affectedRows } = await query("DELETE FROM movies WHERE id=?", [id])
        res.status(200).json({ result: affectedRows === 1 })
      } catch (err) {
        res.status(500).json({ result: false })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}