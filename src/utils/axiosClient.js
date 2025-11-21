import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",   // Use env var for production, fallback to /api for dev
    withCredentials: true,  //
    headers: {
        'Content-Type': 'application/json'      // Sends the data in json formate

    }

},
);





export default axiosClient
