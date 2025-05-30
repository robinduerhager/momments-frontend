import axios from '$/utils/httpclient'

export type UserDTO = {
  id: number;
  name: string;
  avatar: string;
}

/**
 * @description Login handler for a User by providing a secret / password.
 * @param secret The secret to login with, which is the user's password.
 * @returns A Promise that resolves to a JWT Token if the secret is correct.
 */
const login = async (
  secret: string
) => await axios.post('/login', {
    secret
  }).catch((err) => {
    console.error(err)
  }
)

/**
 * @description Get the user data of the currently logged in user.
 * @returns A Promise that resolves to the user data of the currently logged in user.
 */
const me = async () => await axios.get('/me')

export default {
  login,
  me
}