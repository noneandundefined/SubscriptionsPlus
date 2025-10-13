import config from '@/config/client';
import AuthStorageService from '@/services/AuthStorageService';
import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import Qs from 'qs';
import { ToastAndroid } from 'react-native';

// axios base url
const axiosClient = axios.create({
	baseURL: config.API_URL,
	paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'comma' }),
	withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => {
	const token = await AuthStorageService.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// axios helper for response
axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
			return Promise.reject(error);
		}

		// internet
		if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.message.includes('Network request failed')) {
			ToastAndroid.show('No internet connection. Please check your network.', ToastAndroid.SHORT);
			return Promise.reject(error);
		}

		if (error instanceof AxiosError) {
			if (error.response && error.response.status) {
				if (error.response.status === 401) {
					ToastAndroid.show('please connect to account', ToastAndroid.SHORT);

					setTimeout(() => {
						router.replace('/user-create');
					}, 1500);
				} else {
					if (error.response.data.message) {
						ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
					}
				}
			} else if (error.request) {
				ToastAndroid.show('error sending request', ToastAndroid.SHORT);
			} else {
				ToastAndroid.show('unknown request error', ToastAndroid.SHORT);
			}
		} else {
			ToastAndroid.show('an error occurred. please try again', ToastAndroid.SHORT);
		}

		return Promise.reject(error);
	}
);

export default axiosClient;
