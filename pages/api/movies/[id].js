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

    case 'POST':
      res.status(200).json({ id, name: name || `User ${id}` })
      break

    case 'PUT':
      res.status(200).json({ id, name: name || `User ${id}` })
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}