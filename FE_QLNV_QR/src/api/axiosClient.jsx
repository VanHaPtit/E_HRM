import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `http://${window.location.hostname}:8080/api`,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor request để tự động gán Token vào Header
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log("Axios Interceptor - Token from localStorage:", token);
    
    if (token && token !== 'undefined' && token !== 'null') {
        // Đảm bảo headers object tồn tại
        if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } else {
        console.warn("Axios Interceptor - No valid token found in localStorage!");
    }
    return config;
});

// Interceptor để xử lý response (ví dụ: tự động lấy data từ response.data)
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            // Tự động unwrap ApiResponse bọc ngoài từ Spring Boot (nếu có)
            const resData = response.data;
            if (resData && typeof resData === 'object' && 'status' in resData && 'message' in resData && 'data' in resData) {
                return resData.data;
            }
            return resData;
        }
        return response;
    },
    (error) => {
        // Xử lý lỗi chung (401, 403, 500)
        console.error("API Error:", error);
        throw error;
    }
);

export default axiosClient;