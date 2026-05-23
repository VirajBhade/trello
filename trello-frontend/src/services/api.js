import axios from "axios"

const api = axios.create({
  baseURL:  "https://trello-h9k1.onrender.com"
})

export default api