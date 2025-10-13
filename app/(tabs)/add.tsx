import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Subscription } from '@/interfaces/SubscriptionInterface';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ActivityIndicator, Alert, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AutoRenewalSubscription from '@/components/auto-renewal-subscription';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicSubscriptionCreate } from '@/rest/subscriptionAPI';
import { basicUserMe } from '@/rest/userAPI';
import { scheduleSubscriptionNotifications } from '@/utils/NotificationUtils';
import { ensureDefaultNotify } from '@/utils/NotifySubscriptionUtils';
import DatePicker from 'react-datepicker';

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
		auto_renewal: false,
	});

	const { data: basicUserMeResp, loading: basicUserMeLoading } = useHandleServer(['basicUserMeResp'], basicUserMe);

	const reminderFields: (keyof Subscription)[] = ['date_notify_one', 'date_notify_two', 'date_notify_three'];

	const usedReminders = reminderFields.filter((f) => subscription[f] !== null || f === 'date_notify_one');
	const canAddMore = usedReminders.length < reminderFields.length;

	const [activeDateField, setActiveDateField] = useState<keyof Subscription | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

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

		try {
			setLoading(true);
			const subToSave = ensureDefaultNotify(subscription);

			await scheduleSubscriptionNotifications(subToSave);
			await basicSubscriptionCreate(subToSave);

			setSubscription({
				id: Date.now(),
				name: '',
				price: 0,
				date_pay: '',
				date_notify_one: null,
				date_notify_two: null,
				date_notify_three: null,
				auto_renewal: false,
			});
			setActiveDateField(null);
		} finally {
			setLoading(false);
		}
	};

	if (basicUserMeLoading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
				}}
			>
				<ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
			</View>
		);
	}

	return (
		<SafeAreaView style={[styles.container, { flex: 1 }]}>
			<TouchableOpacity onPress={handleSaveSub} style={styles.add_sub}>
				{loading ? (
					<ActivityIndicator size="small" color={colorScheme === 'dark' ? '#fff' : '#000'} />
				) : (
					<ThemedText>Add Sub</ThemedText>
				)}
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

				<View style={{ marginTop: 20, gap: 10 }}>
					<ThemedText style={{ fontWeight: 500 }}>Subscription settings</ThemedText>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							if (!basicUserMeResp?.is_active) {
								Alert.alert('Premium feature', 'This feature is available only for Premium users.')
							}
						}}
						style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: !basicUserMeResp?.is_active ? 0.5 : 1, }}
					>
						<ThemedText style={{ fontSize: 14 }}>Subscription auto-renewal & reminders</ThemedText>

						<Switch
							trackColor={{ false: "#767577", true: "#81b0ff" }}
							thumbColor={subscription.auto_renewal ? "#4ba3f5ff" : "#f4f3f4"}
							ios_backgroundColor="#3e3e3e"
							onValueChange={(value) => {
								if (basicUserMeResp?.is_active) {
									setSubscription((prev) => ({
										...prev,
										auto_renewal: value,
									}));
								} else {
									Alert.alert('Premium feature', 'This feature is available only for Premium users.')
								}
							}}
							value={subscription.auto_renewal}
							style={{ transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }] }}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<AutoRenewalSubscription />
		</SafeAreaView >
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
