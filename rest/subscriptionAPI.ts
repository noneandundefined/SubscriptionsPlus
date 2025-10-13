import { SubscriptionCreateRequest } from '@/interfaces/subscription/subscriptionCreateRequest.interface';
import { SubscriptionEditRequest } from '@/interfaces/subscription/subscriptionEditRequest.interface';
import { ToastAndroid } from 'react-native';
import axiosClient from '.';

const apiPath = '/subs';

export interface SubscriptionResponse {
	id: number;
	created_at: string;
	updated_at: string;
	user_uuid: string;
	name: string;
	price: number;
	date_pay: string;
	date_notify_one?: string | null;
	date_notify_two?: string | null;
	date_notify_three?: string | null;
	auto_renewal: boolean;
}

export const basicSubscriptionsGet = async (search?: string): Promise<SubscriptionResponse[]> => {
	const response = await axiosClient.get(`${apiPath}?search=${search}`);
	return response.data.message;
};

export const basicSubscriptionGetById = async (id: number): Promise<SubscriptionResponse> => {
	const response = await axiosClient.get(`${apiPath}/${id}`);
	return response.data.message;
};

export const basicSubscriptionCreate = async (payload: SubscriptionCreateRequest): Promise<void> => {
	const response = await axiosClient.post(`${apiPath}`, payload);
	ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
};

export const basicSubscriptionImage = async (name: string): Promise<Blob | null> => {
	try {
		const response = await axiosClient.get(`${apiPath}/images/w350?name=${name}`, {
			responseType: 'blob',
		});

		return response.data;
	} catch (err) {
		return null;
	}
};

export const basicSubscriptionEditById = async (payload: SubscriptionEditRequest, id: number): Promise<void> => {
	const response = await axiosClient.put(`${apiPath}/${id}`, payload);
	ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
};

export const basicSubscriptionDeleteById = async (id: number): Promise<void> => {
	const response = await axiosClient.delete(`${apiPath}/${id}`);
	ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
};
