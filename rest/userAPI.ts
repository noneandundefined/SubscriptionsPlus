import axiosClient from '.';

const apiPath = '/users';

export interface userMeResponse {
	created_at: string;
	user_uuid: string;
	email: string;
	plan_name: string;
	end_date?: string | null;
	is_active: boolean;
}

export const basicUserMe = async (): Promise<userMeResponse> => {
	const response = await axiosClient.get(`${apiPath}/me`);
	return response.data.message;
};
