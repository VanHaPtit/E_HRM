import axiosClient from "./axiosClient";

const quaTrinhCongTacApi = {
    getAll: () => {
        return axiosClient.get('/qua-trinh-cong-tac');
    },
    getById: (id) => {
        return axiosClient.get(`/qua-trinh-cong-tac/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/qua-trinh-cong-tac', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/qua-trinh-cong-tac/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/qua-trinh-cong-tac/${id}`);
    },
    findByNhanVien: (nvId) => {
        return axiosClient.get(`/qua-trinh-cong-tac/nhan-vien/${nvId}`);
    }
};

export default quaTrinhCongTacApi;