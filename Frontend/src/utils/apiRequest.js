import axios from "axios"

const ApiRequest = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true
})

export default ApiRequest;