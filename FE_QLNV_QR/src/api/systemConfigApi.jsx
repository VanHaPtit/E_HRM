import axiosClient from "./axiosClient";

const systemConfigApi = {
    getConfig: () => {
        return axiosClient.get('/system-config');
    },
    updateConfig: (data) => {
        return axiosClient.put('/system-config', data);
    }
};

export default systemConfigApi;
