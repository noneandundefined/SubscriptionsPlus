import { TransactionResponse } from '@/rest/transactionAPI';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '../themed-text';

interface QRCodePayProps {
	transaction: TransactionResponse;
}

const QRCodePay: React.FC<QRCodePayProps> = ({ transaction }) => {
	return (
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
});

export default QRCodePay;
