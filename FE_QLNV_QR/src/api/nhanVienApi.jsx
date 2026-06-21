import axiosClient from "./axiosClient";

const nhanVienApi = {
    getAll: () => {
        return axiosClient.get('/nhanvien/all');
    },
    getById: (id) => {
        return axiosClient.get(`/nhanvien/${id}`);
    },
    // Xử lý đặc biệt cho Controller dùng @RequestPart
    create: (data, file) => {
        const formData = new FormData();
        // Backend yêu cầu @RequestPart("nhanVien") là String JSON
        formData.append("nhanVien", JSON.stringify(data));
        if (file) {
            formData.append("file", file);
        }

        return axiosClient.post('/nhanvien/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: (id, data, file) => {
        const formData = new FormData();
        formData.append("nhanVien", JSON.stringify(data));
        if (file) {
            formData.append("file", file);
        }
        return axiosClient.put(`/nhanvien/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: (id) => {
        return axiosClient.delete(`/nhanvien/delete/${id}`);
    },

    findByMaNv: (maNv) => {
        return axiosClient.get(`/nhanvien/search/${maNv}`);
    },
    sendEmail: (data) => {
        return axiosClient.post('/nhanvien/send-email', data);
    }
};

export default nhanVienApi;