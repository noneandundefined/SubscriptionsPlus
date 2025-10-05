import axiosClient from '.';

const apiPath = '/transactions';

export interface TransactionResponse {
	id: number;
	created_at: string;
	updated_at: string;
	ended_at: string;
	plan_id: number;
	user_uuid: string;
	x_token: string;
	amount: number;
	status: string;
}

export const basicTransactionsHistory = async (): Promise<TransactionResponse[]> => {
	const response = await axiosClient.get(`${apiPath}/history`);
	return response.data.message;
};

export const basicTransactionsSubscriptionPay = async (plan_id: number): Promise<string> => {
	const response = await axiosClient.post(`${apiPath}/subscription/pay`, { plan_id });
	return response.data.message;
};

export const basicTransactionsSubscriptionGetById = async (id: number): Promise<TransactionResponse> => {
	const response = await axiosClient.get(`${apiPath}/subscription/id/${id}`);
	return response.data.message;
};

export const basicTransactionsSubscriptionGetByXToken = async (xtoken: string): Promise<TransactionResponse> => {
	const response = await axiosClient.get(`${apiPath}/subscription/token/${xtoken}`);
	return response.data.message;
};

export const basicTransactionsSubscriptionPending = async (): Promise<TransactionResponse> => {
	const response = await axiosClient.get(`${apiPath}/subscriptions/pending`);
	return response.data.message;
};
