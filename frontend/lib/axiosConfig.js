import axios from 'axios'

const app = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Access-Control-Allow-Credentials': 'true',
  },
})

export default app
