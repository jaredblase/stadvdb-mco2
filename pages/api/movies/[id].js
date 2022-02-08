import { query } from '../../../lib/db'

export default async function userHandler(req, res) {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case 'GET':
      const result = await query("SELECT * FROM movies WHERE id = ?", [parseInt(id)])
      res.status(200).json({ result: result[0] })
      break

    case 'POST':
      res.status(200).json({ id, name: name || `User ${id}` })
      break

    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` })

      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}