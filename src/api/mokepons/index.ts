import axios from "axios";
import { Response } from "@utils/types";
// const API_BASE_URL = "https://mokepones-api.herokuapp.com/"
const API_BASE_URL = "http://localhost:3005/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  },
});

export const getUserId = async () => await api.get('mokepon/join')
  .then(res => res.data.id)
  .catch(err => console.log(err.message));

export const getMokepons = async () => await api.get('mokepon')
  .then(res => res.data)
  .catch(err => console.log(err.message));

export const chooseMokepon = async (mokepon: string, id: string): Promise<Response> => await api.post(`mokepon/${id}`, { mokepon })
  .then(res => res.data)
  .catch(err => console.log(err.message));

export const deleteMokepon = async (id: string): Promise<Response> => await api.delete(`mokepon/${id}`)
  .then(res => res.data)
  .catch(err => console.log(err.message));