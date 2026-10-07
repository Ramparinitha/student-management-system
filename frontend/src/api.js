import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export const apiRequest = async (
    endpoint,
    method = "GET",
    data = null
) => {

    const token = localStorage.getItem("token");

    const config = {
        url: endpoint,
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (data !== null) {
        config.data = data;
    }

    const response = await api(config);

    return response.data;
};

export default api;