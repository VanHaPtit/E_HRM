import axiosClient from "./axiosClient";

const luongApi = {

    // GET /api/bangluong/all
    getAll: () => {
        return axiosClient.get('/bangluong/all');
    },

    // GET /api/bangluong/{id}
    getById: (id) => {
        return axiosClient.get(`/bangluong/${id}`);
    },

    // POST /api/bangluong/create
    create: (data) => {
        return axiosClient.post('/bangluong/create', data);
    },

    // PUT /api/bangluong/update/{id}
    update: (id, data) => {
        return axiosClient.put(`/bangluong/update/${id}`, data);
    },

    // DELETE /api/bangluong/delete/{id}
    delete: (id) => {
        return axiosClient.delete(`/bangluong/delete/${id}`);
    },

    // GET /api/bangluong/nv/{nvId}
    getByNhanVien: (nvId) => {
        return axiosClient.get(`/bangluong/nv/${nvId}`);
    },

    // GET /api/bangluong/filter?nvId=&thang=&nam=
    filter: (nvId, thang, nam) => {
        const params = {};

        if (nvId) params.nvId = nvId;
        if (thang) params.thang = thang;
        if (nam) params.nam = nam;

        return axiosClient.get('/bangluong/filter', { params });
    }
};

export default luongApi;
