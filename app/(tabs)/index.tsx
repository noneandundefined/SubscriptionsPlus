import { FlatList, StyleSheet } from 'react-native';

import { SubscriptionEmpty } from '@/components/subscription-empty';
import { SubscriptionItem } from '@/components/subscription-item';
import { Subscription } from '@/interfaces/SubscriptionInterface';
import SubscriptionService from '@/services/SubscriptionService';
import { getNextPaymentDate } from '@/utils/DayUtils';
import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';

import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

	const sortedSubscriptions = [...subscriptions].sort((a, b) => {
		const dateA = new Date(a.date_pay).getTime();
		const dateB = new Date(b.date_pay).getTime();
		return dateA - dateB;
	});

	useEffect(() => {
		const updatedSubs = subscriptions.map((sub) => ({
			...sub,
			date_pay: getNextPaymentDate(sub.date_pay),
		}));

		setSubscriptions(updatedSubs);
	}, []);

	useEffect(() => {
		const requestPermissions = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission for notifications not granted!');
			}
		};

		requestPermissions();
	}, []);

	useEffect(() => {
		const handle = async () => {
			const subs = await SubscriptionService.getAll();

			setSubscriptions(subs);
		};

		handle();
	}, []);

	useEffect(() => {
		const callback = (newSub: Subscription) => {
			setSubscriptions((prev) => [...prev, newSub]);
		};

		const listenerId = EventRegister.addEventListener('subscriptionAdded', callback);

		return () => {
			if (typeof listenerId === 'string') {
				EventRegister.removeEventListener(listenerId);
			}
		};
	}, []);

	const handleDelete = (id: number) => {
		setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
	};

	return (
		<FlatList
			data={sortedSubscriptions}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<SubscriptionItem
					id={item.id}
					name={item.name}
					price={item.price}
					date_pay={item.date_pay}
					date_notify_one={item.date_notify_one}
					date_notify_two={item.date_notify_two}
					date_notify_three={item.date_notify_three}
					onDelete={() => handleDelete(item.id)}
				/>
			)}
			ListEmptyComponent={<SubscriptionEmpty />}
		/>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
});
