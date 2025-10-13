import config from '@/config/client';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicSubscriptionImage, SubscriptionResponse } from '@/rest/subscriptionAPI';
import SubscriptionService from '@/services/SubscriptionService';
import { getNextNotifyDays } from '@/utils/DayUtils';
import { capitalizeFirstLetter } from '@/utils/StringUtils';
// import { getSubscriptionImage } from '@/utils/SubscriptionImage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

	const [advencedVisible, setAdvencedVisible] = useState<boolean>(false);

	const handleEdit = () => {
		setAdvencedVisible(false);
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

	const handleDelete = async () => {
		await SubscriptionService.del(sub.id);

		setAdvencedVisible(false);
		if (onDelete) onDelete();
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={0.7}
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
						<ThemedText style={{ fontSize: 17 }}>{capitalizeFirstLetter(sub.name)}</ThemedText>
						<ThemedText style={styles.text_mini}>
							{new Date(sub.date_pay).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {sub.price} RUB.
						</ThemedText>
					</View>
				</View>

				<TouchableOpacity onPress={() => setAdvencedVisible(true)}>
					<IconSymbol size={25} name="menu" color={colorScheme === 'dark' ? '#525252ff' : '#b4b4b4ff'} />
				</TouchableOpacity>
			</TouchableOpacity>

			<Modal transparent animationType="fade" visible={advencedVisible} onRequestClose={() => setAdvencedVisible(false)}>
				<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setAdvencedVisible(false)}>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
								borderWidth: 1,
								borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
							},
						]}
					>
						<ThemedText style={{ fontSize: 14, marginBottom: 10 }}>Subscription: {capitalizeFirstLetter(sub.name)}</ThemedText>

						<TouchableOpacity
							onPress={handleEdit}
							style={[
								styles.modalButton,
								{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 10,
								},
							]}
						>
							<IconSymbol size={25} name="edit" color={colorScheme === 'dark' ? '#fff' : '#000'} />

							<Text
								style={[
									styles.modalText,
									{
										color: colorScheme === 'dark' ? '#fff' : '#000',
									},
								]}
							>
								Edit subscription
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleDelete}
							style={[
								styles.modalButton,
								{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 10,
								},
							]}
						>
							<IconSymbol size={25} name="delete" color="#c50000ff" />

							<Text
								style={[
									styles.modalText,
									{
										color: '#c50000ff',
									},
								]}
							>
								Delete subscription
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 20,
		paddingHorizontal: 15,
		margin: 4,
		marginHorizontal: 10,
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
		width: 55,
		height: 55,
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
