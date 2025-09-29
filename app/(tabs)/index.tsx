import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { SubscriptionEmpty } from '@/components/subscription-empty';
import { SubscriptionItem } from '@/components/subscription-item';
import { Subscription } from '@/interfaces/SubscriptionInterface';
import SubscriptionService from '@/services/SubscriptionService';
import { getNextPaymentDate } from '@/utils/DayUtils';
import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getGreeting } from '@/utils/GreetingUtils';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
	const colorScheme = useColorScheme();
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

	useEffect(() => {
		const handleEdited = (editedSub: Subscription) => {
			setSubscriptions(prev =>
				prev.map(sub => (sub.id === editedSub.id ? editedSub : sub))
			);
		};

		const listenerId = EventRegister.addEventListener('subscriptionEddited', handleEdited);

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
		<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
			<View style={styles.text_hi_view}>
				<ThemedText style={styles.text_hi_title}>
					{getGreeting()}
				</ThemedText>
				<Text style={[
					styles.text_hi_desc,
					{
						color: colorScheme === "dark" ? "#999" : "#999"
					}
				]}>
					time to manage your subscriptions.
				</Text>
				<View style={[
					styles.total_price,
					{
						backgroundColor: colorScheme === "dark" ? "#222" : "#fff"
					}
				]}>
					<ThemedText>
						{subscriptions.reduce((sum, sub) => sum + sub.price, 0)}
					</ThemedText>
				</View>
			</View>

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
				contentContainerStyle={{ flexGrow: 1 }}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	text_hi_view: {
		maxWidth: Math.min(screenWidth * 0.6, 300),
		flexDirection: "column",
		gap: 7,
		marginVertical: 30,
		marginLeft: 12
	},
	text_hi_title: {
		fontSize: 35,
		fontWeight: 500,
		letterSpacing: 0.6,
		lineHeight: 40,
		includeFontPadding: true
	},
	text_hi_desc: {
		letterSpacing: 0.4,
		fontSize: 25,
		fontWeight: 400,
	},
	total_price: {
		padding: 10,
		borderRadius: 20
	},
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
