import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionResponse } from '@/rest/transactionAPI';
import * as Clipboard from 'expo-clipboard';
import { Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed-text';

interface QRCodePayProps {
	transaction: TransactionResponse;
}

const QRCodePay: React.FC<QRCodePayProps> = ({ transaction }) => {
	const colorScheme = useColorScheme();

	const handleCopy = async (value: string | number) => {
		await Clipboard.setStringAsync(String(value));
		ToastAndroid.show('Success copied!', ToastAndroid.SHORT);
	};

	return (
		<View>
			<Text style={[styles.inputLabel, { color: colorScheme === 'dark' ? '#dadadaff' : '#475569', marginTop: 20 }]}>X Token</Text>
			<TouchableOpacity onPress={() => handleCopy(transaction.x_token)}>
				<TextInput style={styles.input} value={transaction.x_token} editable={false} selectTextOnFocus={true} pointerEvents="none" />
			</TouchableOpacity>
			<Text style={styles.footerTextInput}>
				Please specify your X Token in the payment comment. This is necessary to identify your payment. Without it, subscription
				confirmation is not possible.
			</Text>

			<View style={{ alignSelf: 'center' }}>
				<ThemedText style={{ alignSelf: 'center', fontWeight: 500, marginBottom: 20, fontSize: 20, marginTop: 14 }}>
					Scan QR Code
				</ThemedText>

				<Image
					source={require('@/assets/images/qr-pay.png')}
					style={{ alignSelf: 'center', borderRadius: 10, maxWidth: 250, maxHeight: 250, borderWidth: 1, borderColor: '#afafafff' }}
				/>

				<Text style={styles.footerText}>
					Scan the QR code to pay for your subscription <Text style={{ fontWeight: 500 }}>99.00 ₽</Text>.
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	footerText: {
		color: '#64748b',
		fontSize: 14,
		marginTop: 13,
		lineHeight: 18,
		textAlign: 'center',
		maxWidth: 250,
	},
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
	footerTextInput: {
		color: '#64748b',
		fontSize: 14,
		marginTop: 13,
		lineHeight: 18,
	},
});

export default QRCodePay;
