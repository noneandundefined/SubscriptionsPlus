import { Subscription } from '@/interfaces/SubscriptionInterface';

export const ensureDefaultNotify = (sub: Subscription): Subscription => {
	if (!sub.date_pay) return sub;

	const hasAnyNotify = Boolean(sub.date_notify_one || sub.date_notify_two || sub.date_notify_three);

	if (hasAnyNotify) return sub;

	const notifyDate = new Date(sub.date_pay);
	notifyDate.setDate(notifyDate.getDate() - 3);

	return {
		...sub,
		date_notify_one: notifyDate.toISOString(),
	};
};
