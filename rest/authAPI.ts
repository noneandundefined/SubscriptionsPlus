import AuthStorageService from '@/services/AuthStorageService';
import Toast from 'react-native-toast-message';
import axiosClient from '.';

const apiPath = '/auth';

export const basicAuthCreate = async (email: string) => {
	const response = await axiosClient.post(`${apiPath}/create`, { email });
	AuthStorageService.setToken(response.data.message);

	Toast.show({
		type: 'success',
		text1: 'Successful profile creation!',
	});
};

export const basicAuthDelete = async () => {
	const response = await axiosClient.delete(`${apiPath}/delete`);
	AuthStorageService.removeToken();

	Toast.show({
		type: 'success',
		text1: 'Account has been deleted',
	});
};
