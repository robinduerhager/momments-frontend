import axios from 'axios'
import { mommentsStore } from '@/entrypoints/content/store'

// Setup interceptors for attaching token to any request if available
axios.interceptors.request.use((config) => {
  if (mommentsStore.user.token) 
    config.headers.Authorization = `Bearer ${mommentsStore.user.token}`
  
  return config
})

// Setup base URL to Momments API for axios
axios.defaults.baseURL = import.meta.env.WXT_API_ENDPOINT

export default axios