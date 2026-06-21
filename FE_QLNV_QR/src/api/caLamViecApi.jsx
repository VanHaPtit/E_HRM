import axiosClient from "./axiosClient";

const caLamViecApi = {
    // Lấy danh sách ca làm việc
    getAll: () => {
        return axiosClient.get('/calamviec/all');
    },

    // Lấy chi tiết
    getById: (id) => {
        return axiosClient.get(`/calamviec/${id}`);
    },

    // Tạo mới
    create: (data) => {
        return axiosClient.post('/calamviec/add', data);
    },

    // Cập nhật
    update: (id, data) => {
        return axiosClient.put(`/calamviec/update/${id}`, data);
    },

    // Xóa
    delete: (id) => {
        return axiosClient.delete(`/calamviec/delete/${id}`);
    }
};

export default caLamViecApi;