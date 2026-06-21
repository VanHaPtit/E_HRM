import axiosClient from "./axiosClient";

const cauHinhPhuCapApi = {
    getAll: () => {
        return axiosClient.get('/phu-cap');
    },
    getById: (id) => {
        return axiosClient.get(`/phu-cap/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/phu-cap', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/phu-cap/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/phu-cap/${id}`);
    }
};

export default cauHinhPhuCapApi;