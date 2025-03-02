import axios from '$/utils/httpclient'

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