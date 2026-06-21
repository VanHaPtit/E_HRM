import axiosClient from './axiosClient';

const allowedIpApi = {
    getAll() {
        return axiosClient.get('/allowed-ips');
    },
    create(data) {
        return axiosClient.post('/allowed-ips', data);
    },
    update(id, data) {
        return axiosClient.put(`/allowed-ips/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/allowed-ips/${id}`);
    }
};

export default allowedIpApi;
