import axiosClient from "./axiosClient";

const nguoiPhuThuocApi = {
    // 1. Lấy tất cả
    getAll: () => {
        return axiosClient.get('/nguoi-phu-thuoc');
    },

    // 2. Lấy chi tiết theo ID
    getById: (id) => {
        return axiosClient.get(`/nguoi-phu-thuoc/${id}`);
    },

    // 3. Tạo mới
    create: (data) => {
        return axiosClient.post('/nguoi-phu-thuoc', data);
    },

    // 4. Cập nhật
    update: (id, data) => {
        return axiosClient.put(`/nguoi-phu-thuoc/${id}`, data);
    },

    // 5. Xóa
    delete: (id) => {
        return axiosClient.delete(`/nguoi-phu-thuoc/${id}`);
    },

    // 6. Tìm theo ID Nhân viên
    findByNhanVien: (nvId) => {
        return axiosClient.get(`/nguoi-phu-thuoc/nhan-vien/${nvId}`);
    },

    // 👇 7. (BỔ SUNG) Tìm theo Mã số thuế (Backend đã có hàm này)
    findByMST: (mst) => {
        return axiosClient.get(`/nguoi-phu-thuoc/mst/${mst}`);
    }
};

export default nguoiPhuThuocApi;