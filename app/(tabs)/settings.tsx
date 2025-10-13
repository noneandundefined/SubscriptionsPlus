import { SubscriptionPayNotifyRow } from '@/components/subscription-pay-notify-row';
import SubscriptionStatusPay from '@/components/subscription-status-pay';
import { ThemedText } from '@/components/themed-text';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicAuthDelete } from '@/rest/authAPI';
import { basicTransactionsSubscriptionPending } from '@/rest/transactionAPI';
import { basicUserMe } from '@/rest/userAPI';
import { formatDateUS } from '@/utils/DayUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, ScrollView, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
	const [confirmEmail, setConfirmEmail] = useState<string>('');

	const [isEnabledEmailNotify, setIsEnabledEmailNotify] = useState(false);
	const [isEnabledTelegramNotify, setIsEnabledTelegramNotify] = useState(false);

	const { data: basicUserMeResp, loading, reload: reloadUserMe } = useHandleServer(['basicUserMeResp'], basicUserMe);
	const { data: basicTransactionsSubscriptionPendingResp, reload: reloadSubPending } = useHandleServer(
		['basicTransactionsSubscriptionPendingResp'],
		basicTransactionsSubscriptionPending
	);

	// reload
	useFocusEffect(
		useCallback(() => {
			reloadUserMe();
			reloadSubPending();
		}, [])
	)

	if (loading) {
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
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView>
				<View style={{ marginTop: 20 }}>
					<TouchableOpacity activeOpacity={0.6}>
						<View
							style={{
								padding: 10,
								margin: 15,
								borderRadius: 500,
								backgroundColor: basicUserMeResp?.is_active
									? colorScheme === 'dark'
										? '#092341ff'
										: '#cbd9e9ff'
									: colorScheme === 'dark'
										? '#1d1d1dff'
										: '#f9f9f9',
								borderWidth: 1,
								borderColor: basicUserMeResp?.is_active
									? colorScheme === 'dark'
										? '#0077ffff'
										: '#abd1fdff'
									: colorScheme === 'dark'
										? '#444'
										: '#dfdfdfff',
								alignSelf: 'center',
								width: 100,
								height: 100,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<ThemedText style={{ fontSize: 30 }}>
								{basicUserMeResp?.email ? basicUserMeResp.email.charAt(0).toUpperCase() : '?'}
							</ThemedText>
						</View>
					</TouchableOpacity>

					<ThemedText style={{ alignSelf: 'center', fontSize: 16 }}>{basicUserMeResp?.email}</ThemedText>
				</View>

				{/* Notify for pay subscription */}
				{!basicUserMeResp?.is_active && (
					<View style={{ marginTop: 20, maxWidth: '100%' }}>
						{basicTransactionsSubscriptionPendingResp ? (
							<SubscriptionStatusPay transaction={basicTransactionsSubscriptionPendingResp} />
						) : (
							<SubscriptionPayNotifyRow />
						)}
					</View>
				)}

				<View style={{ margin: 20, gap: 20 }}>
					<ThemedText style={{ fontWeight: 500 }}>Base information</ThemedText>

					<TouchableOpacity activeOpacity={0.7} style={{ gap: 10 }}>
						<Text style={{ color: '#777', fontSize: 15 }}>Plan</Text>
						<ThemedText>{basicUserMeResp?.plan_name}</ThemedText>
						<View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />
					</TouchableOpacity>

					{basicUserMeResp?.is_active && (
						<TouchableOpacity activeOpacity={0.7} style={{ gap: 10 }}>
							<Text style={{ color: '#777', fontSize: 15 }}>Subscription end date</Text>
							<ThemedText>{formatDateUS(basicUserMeResp?.end_date)}</ThemedText>
							<View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />
						</TouchableOpacity>
					)}

					<TouchableOpacity activeOpacity={0.7} style={{ gap: 10 }}>
						<Text style={{ color: '#777', fontSize: 15 }}>Account created</Text>
						<ThemedText>{formatDateUS(basicUserMeResp?.created_at)}</ThemedText>
						<View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />
					</TouchableOpacity>

					<TouchableOpacity style={{ gap: 10 }} onPress={() => setDeleteModalVisible(true)}>
						<Text style={{ color: '#777', fontSize: 15 }}>Account delete</Text>
						<ThemedText style={{ color: "#920e0eff" }}>I want to delete my account.</ThemedText>
						<View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />
					</TouchableOpacity>

					<View style={{ gap: 20 }}>
						<ThemedText style={{ fontWeight: 500 }}>Advenced settings</ThemedText>

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								if (!basicUserMeResp?.is_active) {
									Alert.alert('Premium feature', 'This feature is available only for Premium users.')
								}
							}}
							style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -15, opacity: !basicUserMeResp?.is_active ? 0.5 : 1, }}
						>
							<ThemedText style={{ fontSize: 14 }}>Receive subscription reminders by email</ThemedText>

							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={isEnabledEmailNotify ? "#4ba3f5ff" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={() => {
									if (basicUserMeResp?.is_active) {
										setIsEnabledEmailNotify(!isEnabledEmailNotify)
									} else {
										Alert.alert('Premium feature', 'This feature is available only for Premium users.')
									}
								}}
								value={isEnabledEmailNotify}
								style={{ transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }] }}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								if (!basicUserMeResp?.is_active) {
									Alert.alert('Premium feature', 'This feature is available only for Premium users.')
								}
							}}
							style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -15, opacity: !basicUserMeResp?.is_active ? 0.5 : 1, }}
						>
							<ThemedText style={{ fontSize: 14 }}>Receive subscription reminders via Telegram</ThemedText>

							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={isEnabledTelegramNotify ? "#4ba3f5ff" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={() => {
									if (basicUserMeResp?.is_active) {
										setIsEnabledTelegramNotify(!isEnabledTelegramNotify)
									} else {
										Alert.alert('Premium feature', 'This feature is available only for Premium users.')
									}
								}}
								value={isEnabledTelegramNotify}
								style={{ transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }] }}
							/>
						</TouchableOpacity>

						{isEnabledTelegramNotify && (
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<ThemedText style={{ fontSize: 13 }}>Start the bot in Telegram</ThemedText>
								<TouchableOpacity onPress={() => {
									Linking.openURL("https://t.me/subscriptionsplus_bot");
								}}>
									<ThemedText style={{ fontSize: 13, color: '#4ba3f5ff' }}>@subscriptionplus_bot</ThemedText>
								</TouchableOpacity>
							</View>
						)}
					</View>

					<TouchableOpacity onPress={() => router.push('/transactions')} style={{ alignSelf: 'center', marginTop: 10 }}>
						<Text style={{ color: "#818181ff", fontSize: 15 }}>Go to transactions</Text>
					</TouchableOpacity>
				</View>

				<Modal
					transparent
					animationType="fade"
					visible={deleteModalVisible}
					onRequestClose={() => setDeleteModalVisible(false)}
				>
					<View
						style={{
							flex: 1,
							backgroundColor: 'rgba(0,0,0,0.5)',
							justifyContent: 'center',
							alignItems: 'center',
							padding: 20,
						}}
					>
						<View
							style={{
								width: '100%',
								backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
								borderRadius: 10,
								padding: 20,
							}}
						>
							<ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Account Deletion</ThemedText>
							<ThemedText style={{ marginBottom: 10 }}>
								Please enter your email to confirm account deletion:
							</ThemedText>

							<TextInput
								value={confirmEmail}
								onChangeText={setConfirmEmail}
								placeholder="Enter your email"
								placeholderTextColor={colorScheme === 'dark' ? '#9c9c9cff' : '#4d4d4dff'}
								autoCapitalize="none"
								keyboardType="email-address"
								style={{
									borderWidth: 1,
									borderColor: '#ccc',
									borderRadius: 5,
									padding: 10,
									marginBottom: 20,
									color: colorScheme === 'dark' ? '#fff' : '#000',
								}}
							/>

							<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 30 }}>
								<TouchableOpacity onPress={() => {
									setConfirmEmail('');
									setDeleteModalVisible(false);
								}}>
									<Text style={{ color: colorScheme === 'dark' ? '#c2c2c2ff' : '#4d4d4dff', fontSize: 16 }}>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={() => {
									if (confirmEmail === basicUserMeResp?.email) {
										basicAuthDelete();
										setConfirmEmail('');
										setDeleteModalVisible(false);

										ToastAndroid.show('Account has been deleted!', ToastAndroid.SHORT)

										router.replace('/user-create')
									} else {
										ToastAndroid.show('Email does not match!', ToastAndroid.SHORT)
									}
								}}>
									<Text style={{ color: '#920e0eff', fontSize: 16 }}>Delete</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</ScrollView>
		</SafeAreaView >
	);
};

export default SettingsScreen;
