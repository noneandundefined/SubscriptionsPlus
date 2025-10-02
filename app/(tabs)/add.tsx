import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Subscription } from '@/interfaces/SubscriptionInterface';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import subscriptionService from '@/services/SubscriptionService';
import { scheduleSubscriptionNotifications } from '@/utils/NotificationUtils';
import { ensureDefaultNotify } from '@/utils/NotifySubscriptionUtils';
import DatePicker from 'react-datepicker';
import { EventRegister } from 'react-native-event-listeners';

const alert = (title: string, message: string) => {
	if (Platform.OS === 'web') {
		window.alert(`${title}\n${message}`);
	} else {
		Alert.alert(title, message);
	}
};

const AddScreen = () => {
	const colorScheme = useColorScheme();

	const [subscription, setSubscription] = useState<Subscription>({
		id: Date.now(),
		name: '',
		price: 0,
		date_pay: '',
		date_notify_one: null,
		date_notify_two: null,
		date_notify_three: null,
	});

	const reminderFields: (keyof Subscription)[] = ['date_notify_one', 'date_notify_two', 'date_notify_three'];

	const usedReminders = reminderFields.filter((f) => subscription[f] !== null || f === 'date_notify_one');
	const canAddMore = usedReminders.length < reminderFields.length;

	const [activeDateField, setActiveDateField] = useState<keyof Subscription | null>(null);
	const [showConfetti, setShowConfetti] = useState(false);

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

		const subToSave = ensureDefaultNotify(subscription);

		// Добавляем уведомления для всех notify дат
		await scheduleSubscriptionNotifications(subToSave);

		EventRegister.emit('subscriptionAdded', subToSave);

		await subscriptionService.add(subToSave);

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

		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 3000);
	};

	return (
		<SafeAreaView style={styles.container}>
			{showConfetti && <ConfettiCannon count={120} origin={{ x: -10, y: 0 }} fadeOut />}

			<TouchableOpacity onPress={handleSaveSub} style={styles.add_sub}>
				<ThemedText>Add Sub</ThemedText>
			</TouchableOpacity>

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
};

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
	add_sub: {
		position: 'absolute',
		top: 25,
		right: 0,
		cursor: 'pointer',
	},
	inputs: {
		paddingVertical: 30,
		fontSize: 23,
	},
});

export default AddScreen;
