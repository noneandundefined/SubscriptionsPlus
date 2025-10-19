import config from '@/config/client';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicSubscriptionImage, SubscriptionResponse } from '@/rest/subscriptionAPI';
import { getNextNotifyDays } from '@/utils/DayUtils';
import { capitalizeFirstLetter } from '@/utils/StringUtils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

type NotificationItemProps = {
	sub: SubscriptionResponse;
	onDelete?: () => void;
};

const { width: screenWidth } = Dimensions.get('window');

export const SubscriptionItem: React.FC<NotificationItemProps> = ({ sub, onDelete }) => {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
	const [confirmSub, setConfirmSub] = useState<string>('');

	const handleEdit = () => {
		setConfirmVisible(false);
		router.push({
			pathname: '/edit',
			params: {
				id: sub.id,
				name: sub.name,
				price: sub.price,
				date_pay: sub.date_pay,
				date_notify_one: sub.date_notify_one,
				date_notify_two: sub.date_notify_two,
				date_notify_three: sub.date_notify_three,
				auto_renewal: String(sub.auto_renewal),
			},
		});
	};

	const { data: basicSubscriptionImageResp } = useHandleServer(['basicSubscriptionImageResp', sub.name], () => basicSubscriptionImage(sub.name))

	const renderRightActions = () => (
		<TouchableOpacity
			onPress={() => setConfirmVisible(true)}
			activeOpacity={0.6}
			style={{
				backgroundColor: '#e22d00ff',
				justifyContent: 'center',
				alignItems: 'center',
				width: 50,
				marginLeft: 10,
				borderRadius: 12,
			}}
		>
			<IconSymbol name="delete" color="#fff" size={28} />
		</TouchableOpacity>
	);

	return (
		<>
			<Swipeable
				renderRightActions={renderRightActions}
				onSwipeableWillOpen={() => setConfirmVisible(true)}
				friction={2}
				containerStyle={{
					marginVertical: 6,
					height: 78,
					marginHorizontal: 10,
				}}
			>
				<TouchableOpacity
					activeOpacity={0.6}
					onPress={handleEdit}
					style={[
						styles.row,
						{
							backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
							borderWidth: 1,
							borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
						},
					]}
				>
					<View style={styles.row_left}>
						{basicSubscriptionImageResp ? (
							<Image
								source={{ uri: `${config.API_URL}/subs/images/w350?name=${sub.name}` }}
								style={styles.date_notify}
							/>
						) : (
							<View
								style={[
									styles.date_notify,
									{
										backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
										borderWidth: 1,
										borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
									},
								]}
							>
								<ThemedText style={styles.date_notify_text}>
									{getNextNotifyDays(sub.date_notify_one, sub.date_notify_two, sub.date_notify_three)
										? `${getNextNotifyDays(sub.date_notify_one, sub.date_notify_two, sub.date_notify_three)}d`
										: '3d'}
								</ThemedText>
							</View>
						)}

						<View>
							<ThemedText style={{ fontSize: 17, fontWeight: 500 }}>{capitalizeFirstLetter(sub.name)}</ThemedText>
							<ThemedText style={[styles.text_mini, { marginTop: -1 }]}>
								{new Date(sub.date_pay).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
							</ThemedText>
						</View>
					</View>

					<ThemedText style={{ fontWeight: 500 }}>₽ {sub.price} <Text style={{ fontSize: 13, color: "#999", fontWeight: 400 }}>/ month</Text></ThemedText>
				</TouchableOpacity>
			</Swipeable>

			<Modal
				transparent
				animationType="fade"
				visible={confirmVisible}
				onRequestClose={() => setConfirmVisible(false)}
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
						<ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Subscription Deletion</ThemedText>
						<ThemedText style={{ marginBottom: 10 }}>
							Please enter the subscription name to confirm deletion:
						</ThemedText>

						<TextInput
							value={confirmSub}
							onChangeText={setConfirmSub}
							placeholder={`Write name subscription - ${sub.name}`}
							placeholderTextColor={colorScheme === 'dark' ? '#9c9c9cff' : '#4d4d4dff'}
							autoCapitalize="none"
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
								setConfirmSub('');
								setConfirmVisible(false);
							}}>
								<Text style={{ color: colorScheme === 'dark' ? '#c2c2c2ff' : '#4d4d4dff', fontSize: 16 }}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {
								if (confirmSub === sub.name) {
									setConfirmVisible(false);
									if (onDelete) onDelete();
								} else {
									ToastAndroid.show('Name does not match!', ToastAndroid.SHORT)
								}
							}}>
								<Text style={{ color: '#920e0eff', fontSize: 16 }}>Delete</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 13,
		paddingHorizontal: 15,
		borderRadius: 25,
		borderWidth: 1,
	},
	row_left: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
	},
	text_mini: {
		fontSize: 13,
		color: '#888',
	},
	date_notify: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
		cursor: 'pointer',
	},
	date_notify_text: {
		fontWeight: 700,
		fontSize: 18,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		borderRadius: 10,
		padding: 20,
		minWidth: Math.max(100, screenWidth * 0.8),
	},
	modalButton: {
		paddingVertical: 15,
	},
	modalText: {
		fontSize: 16,
		color: '#000',
	},
});
