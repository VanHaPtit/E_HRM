import axiosClient from "./axiosClient";

const chamCongChiTietApi = {
    getAll: () => {
        return axiosClient.get('/cham-cong-chi-tiet');
    },
    getById: (id) => {
        return axiosClient.get(`/cham-cong-chi-tiet/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/cham-cong-chi-tiet', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/cham-cong-chi-tiet/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/cham-cong-chi-tiet/${id}`);
    },
    // Tìm chấm công theo nhân viên và tháng (nếu backend có)
    getByNhanVienAndMonth: (nhanVienId, month, year) => {
        return axiosClient.get('/cham-cong-chi-tiet/filter', {
            params: { nhanVienId, month, year }
        });
    },
    ipCheckin: (nhanVienId) => {
        return axiosClient.post('/cham-cong-chi-tiet/ip-checkin', null, {
            params: { nhanVienId }
        });
    },
    scanQR: (nhanVienId, token) => {
        return axiosClient.post('/cham-cong-chi-tiet/scan', null, {
            params: { nhanVienId, token }
        });
    }
};

export default chamCongChiTietApi;