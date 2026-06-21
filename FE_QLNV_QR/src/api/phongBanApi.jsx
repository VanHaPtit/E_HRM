import axiosClient from "./axiosClient";

const phongBanApi = {
    getAll: () => {
        return axiosClient.get('/phongban/list');
    },
    getById: (id) => {
        return axiosClient.get(`/phongban/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/phongban/create', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/phongban/update/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/phongban/delete/${id}`);
    }
};

// 👇 QUAN TRỌNG: Dòng này bắt buộc phải có để sửa lỗi
export default phongBanApi;