import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",   // that is the default URL
    withCredentials: true,  //
    headers: {
        'Content-Type': 'application/json'      // Sends the data in json formate

    }

},
);





export default axiosClient