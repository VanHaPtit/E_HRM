import axiosClient from "./axiosClient";

const quyPhepNamApi = {
    getAll: () => {
        return axiosClient.get('/quy-phep-nam');
    },
    getById: (id) => {
        return axiosClient.get(`/quy-phep-nam/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/quy-phep-nam', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/quy-phep-nam/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/quy-phep-nam/${id}`);
    },
    // Tìm kiếm nâng cao (nếu cần dùng server-side filtering)
    search: (nhanVienId, nam) => {
        return axiosClient.get('/quy-phep-nam/search', {
            params: { nhanVienId, nam }
        });
    }
};

export default quyPhepNamApi;