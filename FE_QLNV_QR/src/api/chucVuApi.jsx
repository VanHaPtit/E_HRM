import axiosClient from "./axiosClient";

const chucVuApi = {
    // Lấy tất cả
    getAll: () => {
        return axiosClient.get('/chucvu/list');
    },
    // Lấy theo ID
    getById: (id) => {
        return axiosClient.get(`/chucvu/${id}`);
    },
    // Tạo mới
    create: (data) => {
        return axiosClient.post('/chucvu/create', data);
    },
    // Cập nhật
    update: (id, data) => {
        return axiosClient.put(`/chucvu/update/${id}`, data);
    },
    // Xóa
    delete: (id) => {
        return axiosClient.delete(`/chucvu/delete/${id}`);
    },
    // Tìm kiếm (Theo tên chức vụ)
    search: (keyword) => {
        return axiosClient.get('/chucvu/search', {
            params: { keyword }
        });
    }
};

export default chucVuApi;