import axiosClient from "./axiosClient";

const donXinPhepApi = {
    getAll: () => {
        return axiosClient.get('/don-xin-phep');
    },
    getById: (id) => {
        return axiosClient.get(`/don-xin-phep/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/don-xin-phep', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/don-xin-phep/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/don-xin-phep/${id}`);
    },

    // --- Filter ---
    findByNhanVien: (nvId) => {
        return axiosClient.get(`/don-xin-phep/nhan-vien/${nvId}`);
    },
    findByTrangThai: (status) => {
        return axiosClient.get(`/don-xin-phep/trang-thai/${status}`);
    },

    // --- Phê duyệt ---
    // nguoiDuyetId: ID của người thực hiện thao tác (thường lấy từ user đang login)
    approve: (id, nguoiDuyetId) => {
        return axiosClient.put(`/don-xin-phep/${id}/approve/${nguoiDuyetId}`);
    },
    reject: (id, nguoiDuyetId) => {
        return axiosClient.put(`/don-xin-phep/${id}/reject/${nguoiDuyetId}`);
    }
};

export default donXinPhepApi;