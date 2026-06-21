import axiosClient from "./axiosClient";

const hopDongApi = {
    getAll: () => axiosClient.get('/hop-dong'),
    getById: (id) => axiosClient.get(`/hop-dong/${id}`),
    getByNhanVien: (nvId) => axiosClient.get(`/hop-dong/nhan-vien/${nvId}`),
    create: (data) => axiosClient.post('/hop-dong', data),
    update: (id, data) => axiosClient.put(`/hop-dong/${id}`, data),
    delete: (id) => axiosClient.delete(`/hop-dong/${id}`),
};

export default hopDongApi;