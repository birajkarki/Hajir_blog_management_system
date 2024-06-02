import axios from "axios"

const ApiRequest = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
      },
})

export default ApiRequest;