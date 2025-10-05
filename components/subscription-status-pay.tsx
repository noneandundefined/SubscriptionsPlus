import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionResponse } from '@/rest/transactionAPI';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TimerTransaction from './timer-transaction';

interface SubscriptionStatusPayProps {
	transaction: TransactionResponse;
}

const SubscriptionStatusPay: React.FC<SubscriptionStatusPayProps> = ({ transaction }) => {
	const colorScheme = useColorScheme();
	const router = useRouter();

	const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

	return (
		<TouchableOpacity
			onPress={() => router.push({ pathname: '/subscription-pay-wait', params: { xtoken: transaction.x_token } })}
			activeOpacity={0.6}
			style={{
				backgroundColor: '#fff7ed',
				margin: 4,
				marginHorizontal: 12,
				paddingHorizontal: 20,
				paddingVertical: 10,
				borderRadius: 500,
			}}
		>
			<View style={styles.header}>
				{isTimeOver ? (
					<Text style={{ color: "#92400e" }}>Just a few more minutes</Text>
				) : (
					<TimerTransaction createdAt={transaction.created_at} endedAt={transaction.ended_at} color="#92400e" onTimerEnd={() => setIsTimeOver(true)} />
				)}

				<View style={styles.statusBadge}>
					<View style={styles.dot} />
					<Text style={styles.statusText}>{transaction.status}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffead1ff',
		borderRadius: 20,
		paddingVertical: 7,
		paddingHorizontal: 17,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#f59e0b',
		marginRight: 6,
	},
	statusText: {
		fontSize: 13,
		color: '#92400e',
		fontWeight: '600',
	},
	subtext: {
		color: '#92400e',
		fontSize: 12,
		marginTop: 4,
		marginBottom: 14,
	},
});

export default SubscriptionStatusPay;
