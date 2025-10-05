import { CARD_PAY } from '@/constants/card';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionResponse } from '@/rest/transactionAPI';
import * as Clipboard from 'expo-clipboard';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

interface CardPayProps {
	transaction: TransactionResponse;
}

const CardPay: React.FC<CardPayProps> = ({ transaction }) => {
	const colorScheme = useColorScheme();

	const handleCopy = async (value: string | number) => {
		await Clipboard.setStringAsync(String(value));
		ToastAndroid.show('Success copied!', ToastAndroid.SHORT);
	};

	return (
		<View>
			<Text style={[styles.inputLabel, { marginTop: 14, color: colorScheme === 'dark' ? '#dadadaff' : '#475569' }]}>
				Card to send
			</Text>
			<TouchableOpacity onPress={() => handleCopy(CARD_PAY)}>
				<TextInput style={styles.input} value={CARD_PAY} editable={false} selectTextOnFocus={true} pointerEvents="none" />
			</TouchableOpacity>

			<Text style={[styles.footerText, { marginBottom: 13 }]}>
				Please make the payment to the card above. This is necessary for the correct confirmation of the subscription.
			</Text>

			<Text style={[styles.inputLabel, { color: colorScheme === 'dark' ? '#dadadaff' : '#475569' }]}>Subscription price</Text>
			<TouchableOpacity onPress={() => handleCopy(transaction.amount)}>
				<TextInput style={styles.input} value={String(`${transaction.amount}.00`)} editable={false} selectTextOnFocus={true} pointerEvents="none" />
			</TouchableOpacity>

			<Text style={[styles.footerText, { marginBottom: 13 }]}>Please specify the subscription cost when making a payment.</Text>

			<Text style={[styles.inputLabel, { color: colorScheme === 'dark' ? '#dadadaff' : '#475569' }]}>X Token</Text>
			<TouchableOpacity onPress={() => handleCopy(transaction.x_token)}>
				<TextInput style={styles.input} value={transaction.x_token} editable={false} selectTextOnFocus={true} pointerEvents="none" />
			</TouchableOpacity>

			<Text style={styles.footerText}>
				Please specify your X Token in the payment comment. This is necessary to identify your payment. Without it, subscription
				confirmation is not possible.
			</Text>
		</View>
	);
};

export default CardPay;

const styles = StyleSheet.create({
	inputLabel: {
		fontWeight: '600',
		marginBottom: 6,
	},
	footerText: {
		color: '#64748b',
		fontSize: 13,
		marginTop: 13,
		lineHeight: 18,
	},
	input: {
		backgroundColor: '#edeef0ff',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 15,
	},
});
