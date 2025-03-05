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
    secret: secret
  }).catch((err) => {
    console.error(err)
  }
)

export default {
  login
}