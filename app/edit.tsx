import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Subscription } from '@/interfaces/SubscriptionInterface';
import SubscriptionService from '@/services/SubscriptionService';
import { scheduleSubscriptionNotifications } from '@/utils/NotificationUtils';
import { ensureDefaultNotify } from '@/utils/NotifySubscriptionUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { SafeAreaView } from 'react-native-safe-area-context';

const alert = (title: string, message: string) => {
	if (Platform.OS === 'web') {
		window.alert(`${title}\n${message}`);
	} else {
		Alert.alert(title, message);
	}
};

export default function EditScreen() {
	const router = useRouter();
	const params = useSearchParams();
	const colorScheme = useColorScheme();

	const [subscription, setSubscription] = useState<Subscription>({
		id: Number(params.get('id')),
		name: params.get('name') ?? '',
		price: Number(params.get('price')) || 0,
		date_pay: params.get('date_pay') ?? '',
		date_notify_one: params.get('date_notify_one') ?? null,
		date_notify_two: params.get('date_notify_two') ?? null,
		date_notify_three: params.get('date_notify_three') ?? null,
	});

	const reminderFields: (keyof Subscription)[] = ['date_notify_one', 'date_notify_two', 'date_notify_three'];

	const usedReminders = reminderFields.filter((f) => subscription[f] !== null || f === 'date_notify_one');
	const canAddMore = usedReminders.length < reminderFields.length;

	const [activeDateField, setActiveDateField] = useState<keyof Subscription | null>(null);

	const handleDateChange = (date: Date | null, field: keyof Subscription) => {
		if (!date) {
			setActiveDateField(null);
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (date < today) {
			alert('Invalid date', 'You cannot select a date earlier than today.');
			return;
		}

		setSubscription((prev) => ({
			...prev,
			[field]: date.toISOString(),
		}));

		setActiveDateField(null);
	};

	const handleSaveSub = async () => {
		if (!subscription.name.trim()) {
			alert('Validatio error', 'Please enter subscription name');
			return;
		}

		if (!subscription.price || subscription.price <= 0) {
			alert('Validatio error', 'Please enter subscription name');
			return;
		}

		if (!subscription.date_pay) {
			alert('Validatio error', 'Please enter subscription name');
			return;
		}

		const subToEdit = ensureDefaultNotify(subscription);

		// Добавляем уведомления для всех notify дат
		await scheduleSubscriptionNotifications(subToEdit);

		EventRegister.emit('subscriptionEddited', subToEdit);

		await SubscriptionService.update(subToEdit);

		setSubscription({
			id: Date.now(),
			name: '',
			price: 0,
			date_pay: '',
			date_notify_one: null,
			date_notify_two: null,
			date_notify_three: null,
		});

		setActiveDateField(null);
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<TouchableOpacity style={[styles.backCircle, { backgroundColor: colorScheme === 'dark' ? "#1c1f21" : "#eee" }]} onPress={() => router.replace('/')}>
					<IconSymbol size={25} name="chevron-left" color={colorScheme === 'dark' ? '#525252ff' : '#b4b4b4ff'} />
				</TouchableOpacity>

				<TouchableOpacity onPress={handleSaveSub}>
					<ThemedText>Save Sub</ThemedText>
				</TouchableOpacity>
			</View>

			<View style={styles.content_add_container}>
				<TextInput
					style={[
						styles.inputs,
						{
							color: colorScheme === 'dark' ? '#fff' : '#000',
						},
					]}
					value={subscription.name}
					onChangeText={(text) => {
						setSubscription((prev) => ({
							...prev,
							name: text,
						}));
					}}
					placeholder="Write name subscription"
					placeholderTextColor={colorScheme === 'dark' ? '#888' : '#222'}
				/>

				<TextInput
					style={[
						styles.inputs,
						{
							color: colorScheme === 'dark' ? '#fff' : '#000',
						},
					]}
					value={subscription.price ? String(subscription.price) : ''}
					onChangeText={(text) => {
						setSubscription((prev) => ({
							...prev,
							price: Number(text) || 0,
						}));
					}}
					keyboardType="numeric"
					placeholder="Write price subscription"
					placeholderTextColor={colorScheme === 'dark' ? '#888' : '#222'}
				/>

				<TouchableOpacity onPress={() => setActiveDateField('date_pay')}>
					<View style={styles.view_row}>
						<ThemedText>Date</ThemedText>

						<View style={styles.choose_param_row}>
							<Text
								style={[
									{
										color: '#888',
									},
								]}
							>
								{subscription.date_pay ? new Date(subscription.date_pay).toLocaleDateString() : 'None'}
							</Text>

							<IconSymbol size={28} name="keyboard-arrow-right" color="#888" />
						</View>
					</View>
				</TouchableOpacity>

				{usedReminders.map((field, index) => (
					<TouchableOpacity key={field} onPress={() => setActiveDateField(field)}>
						<View style={styles.view_row}>
							<ThemedText>
								{usedReminders.length === 1 ? 'Subscription reminder date' : `Additional reminder ${index}`}
							</ThemedText>

							<View style={styles.choose_param_row}>
								<Text style={{ color: '#888' }}>
									{subscription[field] ? new Date(subscription[field] as string).toLocaleDateString() : 'None'}
								</Text>
								<IconSymbol size={28} name="keyboard-arrow-right" color="#888" />
							</View>
						</View>
					</TouchableOpacity>
				))}

				{activeDateField &&
					(Platform.OS === 'web' ? (
						<DatePicker
							selected={subscription[activeDateField] ? new Date(subscription[activeDateField] as string) : null}
							onChange={(date: Date | null) => handleDateChange(date, activeDateField)}
							dateFormat="dd/MM/yyyy"
						/>
					) : (
						<DateTimePicker
							value={subscription[activeDateField] ? new Date(subscription[activeDateField] as string) : new Date()}
							mode="date"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={(_, date) => handleDateChange(date || null, activeDateField)}
						/>
					))}

				{canAddMore && (
					<TouchableOpacity
						onPress={() => {
							const nextField = reminderFields[usedReminders.length];
							setSubscription((prev) => ({
								...prev,
								[nextField]: '',
							}));
						}}
					>
						<Text style={[styles.add_subscription_reminde_date, { color: colorScheme === 'dark' ? '#888' : '#222' }]}>
							Add subscription reminder date
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 30,
	},
	view_row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	content_add_container: {
		marginTop: 30,
		flexDirection: 'column',
		gap: 20,
	},
	add_subscription_reminde_date: {
		textAlign: 'center',
		fontSize: 14,
		textDecorationLine: 'underline',
	},
	choose_param_row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputs: {
		paddingVertical: 30,
		fontSize: 23,
	},
	backCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#1c1f21',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
