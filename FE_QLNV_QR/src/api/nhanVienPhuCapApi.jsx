import axiosClient from "./axiosClient";

const nhanVienPhuCapApi = {
    getAll: () => {
        return axiosClient.get('/phu-cap-nhan-vien');
    },
    getById: (id) => {
        return axiosClient.get(`/phu-cap-nhan-vien/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/phu-cap-nhan-vien', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/phu-cap-nhan-vien/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/phu-cap-nhan-vien/${id}`);
    },
    // Tìm theo hợp đồng
    findByHopDong: (hopDongId) => {
        return axiosClient.get(`/phu-cap-nhan-vien/hop-dong/${hopDongId}`);
    },
    // Tìm theo loại phụ cấp
    findByPhuCap: (phuCapId) => {
        return axiosClient.get(`/phu-cap-nhan-vien/phu-cap/${phuCapId}`);
    }
};

export default nhanVienPhuCapApi;