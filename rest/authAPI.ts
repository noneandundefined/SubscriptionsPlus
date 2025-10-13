import AuthStorageService from '@/services/AuthStorageService';
import { ToastAndroid } from 'react-native';
import axiosClient from '.';

const apiPath = '/auth';

export const basicAuthCreate = async (email: string) => {
	const response = await axiosClient.post(`${apiPath}/create`, { email });
	AuthStorageService.setToken(response.data.message);

	ToastAndroid.show('Successful profile creation!', ToastAndroid.SHORT);
};

export const basicAuthLoginRestore = async () => {
	const token = await AuthStorageService.getRefreshToken();

	const response = await axiosClient.get(`${apiPath}/restore_login?token=${encodeURIComponent(token ?? '')}`);

	if (response.status === 200) {
		await AuthStorageService.setToken(response.data.message);

		ToastAndroid.show('Successful account recovery!', ToastAndroid.SHORT);
		return;
	}

	console.log("don't find refresh_token");
};

export const basicAuthRestoreAccess = async (email: string) => {
	const response = await axiosClient.post(`${apiPath}/req_restore_access`, { email });
	const token = response.data.message.token;

	if (token) {
		await AuthStorageService.setRefreshToken(response.data.message.token);
		ToastAndroid.show(response.data.message.msg, ToastAndroid.SHORT);
	}
};

export const basicAuthDelete = async () => {
	const response = await axiosClient.delete(`${apiPath}/delete`);
	AuthStorageService.removeToken();

	ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
};
