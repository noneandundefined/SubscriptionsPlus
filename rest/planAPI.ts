import axiosClient from '.';

const apiPath = '/plans';

export interface PlanResponse {
	id: number;
	created_at: string;
	updated_at: string;
	name: string;
	price: number;
	max_total_subscriptions: number | null;
	auto_find_subscriptions: boolean;
}

export const basicPlansGet = async (): Promise<PlanResponse[]> => {
	const response = await axiosClient.get(`${apiPath}`);
	return response.data.message;
};
