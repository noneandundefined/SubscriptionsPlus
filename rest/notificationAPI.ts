import axiosClient from '.';

const apiPath = '/notify';

export const basicNotifyToken = async (token: string) => {
	await axiosClient.post(`${apiPath}/token`, { token });
};
