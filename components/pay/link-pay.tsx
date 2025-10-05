import { PAY_LINK } from '@/constants/pay';
import { TransactionResponse } from '@/rest/transactionAPI';
import * as Clipboard from 'expo-clipboard';
import { Linking, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';

interface LinkPayProps {
	transaction: TransactionResponse;
}

const LinkPay: React.FC<LinkPayProps> = ({ transaction }) => {
	const colorScheme = useColorScheme();

	const handleCopy = async (value: string | number) => {
		await Clipboard.setStringAsync(String(value));
		ToastAndroid.show('Success copied!', ToastAndroid.SHORT);
	};

	return (
		<View style={{ marginVertical: 20 }}>
			<Text style={[styles.inputLabel, { color: colorScheme === 'dark' ? '#dadadaff' : '#475569' }]}>Subscription price</Text>
			<TouchableOpacity onPress={() => handleCopy(transaction.amount)}>
				<TextInput style={styles.input} value={String(`${transaction.amount}.00`)} editable={false} selectTextOnFocus={true} />
			</TouchableOpacity>

			<Text style={[styles.footerText, { marginBottom: 13 }]}>Please specify the subscription cost when making a payment.</Text>

			<TouchableOpacity
				onPress={() => Linking.openURL(PAY_LINK)}
				style={{ marginTop: 5, backgroundColor: colorScheme === 'dark' ? '#60A5FA' : '#2563EB', padding: 14, borderRadius: 6 }}
			>
				<Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>Pay using the link</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	inputLabel: {
		fontWeight: '600',
		marginBottom: 6,
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
	footerText: {
		color: '#64748b',
		fontSize: 14,
		marginTop: 13,
		lineHeight: 18,
	},
});

export default LinkPay;
