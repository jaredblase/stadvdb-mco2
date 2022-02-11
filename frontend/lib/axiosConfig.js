import axios from 'axios'

const app = axios.create({
  withCredentials: true,
})

export default app
