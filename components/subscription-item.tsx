import { useColorScheme } from '@/hooks/use-color-scheme';
import SubscriptionService from '@/services/SubscriptionService';
import { getNextNotifyDays } from '@/utils/DayUtils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

type NotificationItemProps = {
	id: number;
	name: string;
	price: number;
	date_pay: string;
	date_notify_one: string | null;
	date_notify_two: string | null;
	date_notify_three: string | null;
	onDelete?: () => void;
};

const { width: screenWidth } = Dimensions.get('window');

export const SubscriptionItem: React.FC<NotificationItemProps> = ({
	id,
	name,
	price,
	date_pay,
	date_notify_one,
	date_notify_two,
	date_notify_three,
	onDelete,
}) => {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [advencedVisible, setAdvencedVisible] = useState<boolean>(false);

	const handleEdit = () => {
		setAdvencedVisible(false);
		router.push({
			pathname: '/edit',
			params: {
				id,
				name,
				price,
				date_pay,
				date_notify_one,
				date_notify_two,
				date_notify_three,
			}
		})
	};

	const handleDelete = async () => {
		await SubscriptionService.del(id);

		setAdvencedVisible(false);
		if (onDelete) onDelete();
	};

	return (
		<View
			style={[
				styles.row,
				{
					backgroundColor: colorScheme === 'dark' ? '#222' : '#f9f9f9',
				},
			]}
		>
			<View style={styles.row_left}>
				<View
					style={[
						styles.date_notify,
						{
							backgroundColor: colorScheme === 'dark' ? '#333' : '#eee',
						},
					]}
				>
					<ThemedText style={styles.date_notify_text}>
						{getNextNotifyDays(date_notify_one, date_notify_two, date_notify_three)}
					</ThemedText>
				</View>

				<View>
					<ThemedText>{name}</ThemedText>
					<ThemedText style={styles.text_mini}>
						{new Date(date_pay).toLocaleDateString()} - {price} RUB.
					</ThemedText>
				</View>
			</View>

			<TouchableOpacity onPress={() => setAdvencedVisible(true)}>
				<IconSymbol size={22} name="menu" color="#888" />
			</TouchableOpacity>

			<Modal transparent animationType="fade" visible={advencedVisible} onRequestClose={() => setAdvencedVisible(false)}>
				<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setAdvencedVisible(false)}>
					<View
						style={[
							styles.modalContent
						]}
					>
						<TouchableOpacity
							onPress={handleEdit}
							style={styles.modalButton}
						>
							<Text
								style={styles.modalText}
							>
								Edit
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleDelete}
							style={styles.modalButton}
						>
							<Text
								style={styles.modalText}
							>
								Delete
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 25,
		paddingHorizontal: 15,
		margin: 4,
		borderRadius: 10,
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
		backgroundColor: "#ccc",
		borderRadius: 10,
		padding: 20,
		minWidth: Math.max(100, screenWidth * 0.8),
	},
	modalButton: {
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#000"
	},
	modalText: {
		fontSize: 16,
		color: "#000"
	},
});
