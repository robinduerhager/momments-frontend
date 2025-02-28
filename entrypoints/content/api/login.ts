import axios from './httpclient'

// Login Handler
export const login = async (
  secret: string
) => await axios.post('/login', {
    secret: secret
  })