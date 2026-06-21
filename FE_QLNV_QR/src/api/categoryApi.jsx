import axiosClient from "./axiosClient";

const categoryApi = {
    // --- PHÒNG BAN (Khớp PhongBanController) ---
    getPhongBans: () => axiosClient.get('/phongban/list'),
    createPhongBan: (data) => axiosClient.post('/phongban/create', data),
    updatePhongBan: (id, data) => axiosClient.put(`/phongban/update/${id}`, data),
    deletePhongBan: (id) => axiosClient.delete(`/phongban/delete/${id}`),
    searchPhongBan: (keyword) => axiosClient.get(`/phongban/search?keyword=${keyword}`),

    // --- CHỨC VỤ (Khớp ChucVuController) ---
    getChucVus: () => axiosClient.get('/chucvu/list'),
    createChucVu: (data) => axiosClient.post('/chucvu/create', data),
    updateChucVu: (id, data) => axiosClient.put(`/chucvu/update/${id}`, data),
    deleteChucVu: (id) => axiosClient.delete(`/chucvu/delete/${id}`),

    // --- CA LÀM VIỆC (Khớp CaLamViecController) ---
    getCaLamViecs: () => axiosClient.get('/calamviec/all'),
    createCaLamViec: (data) => axiosClient.post('/calamviec/add', data),
    updateCaLamViec: (id, data) => axiosClient.put(`/calamviec/update/${id}`, data),
    deleteCaLamViec: (id) => axiosClient.delete(`/calamviec/delete/${id}`),
};

export default categoryApi;