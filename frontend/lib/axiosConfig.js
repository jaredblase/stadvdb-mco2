import axios from 'axios'

const app = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Access-Control-Allow-Credentials': 'true',
  },
})

export default app
