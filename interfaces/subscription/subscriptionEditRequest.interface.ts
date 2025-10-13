export interface SubscriptionEditRequest {
	name: string;
	price: number;
	date_pay: string;
	date_notify_one?: string | null;
	date_notify_two?: string | null;
	date_notify_three?: string | null;
	auto_renewal: boolean;
}
