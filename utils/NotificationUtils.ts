import { Subscription } from '@/interfaces/SubscriptionInterface';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { formatDateUS } from './DayUtils';

export const scheduleSubscriptionNotifications = async (subscription: Subscription) => {
	const notifyFields: Array<'date_notify_one' | 'date_notify_two' | 'date_notify_three'> = [
		'date_notify_one',
		'date_notify_two',
		'date_notify_three',
	];

	const now = new Date();

	for (const field of notifyFields) {
		const notifyDateStr = subscription[field];
		if (!notifyDateStr) continue;

		const notifyDate = new Date(String(notifyDateStr));
		if (notifyDate <= now) continue;

		const secondsUntilNotify = Math.max(1, (notifyDate.getTime() - now.getTime()) / 1000);

		try {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: `Upcoming subscription: ${subscription.name}`,
					body: `Your plan will renew for ${subscription.price} RUB on ${
						formatDateUS(subscription.date_pay) || 'the upcoming date'
					}`,
					sound: Platform.OS === 'android' ? 'default' : undefined,
				},
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
					seconds: secondsUntilNotify,
					repeats: false,
					channelId: Platform.OS === 'android' ? 'subscriptions' : undefined,
				},
			});
		} catch (e) {
			console.error('Error scheduling notification:', e);
		}
	}
};
