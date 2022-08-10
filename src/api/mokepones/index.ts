import axios from "axios";
const API_BASE_URL = "https://mokepones-api.herokuapp.com/"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  },
});

export const getUserId = async () => api.get('/mokepon/join').then(res => res.data.id);