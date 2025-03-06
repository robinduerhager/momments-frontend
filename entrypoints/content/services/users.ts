import axios from '$/utils/httpclient'

export type UserDTO = {
  id: number;
  name: string;
  avatar: string;
}

// Login Handler
const login = async (
  secret: string
) => await axios.post('/login', {
    secret
  }).catch((err) => {
    console.error(err)
  }
)

const me = async () => await axios.get('/me')

export default {
  login,
  me
}