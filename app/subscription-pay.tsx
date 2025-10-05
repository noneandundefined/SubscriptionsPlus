import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { basicPlansGet, PlanResponse } from '@/rest/planAPI';
import { basicTransactionsSubscriptionPay } from '@/rest/transactionAPI';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionPayScreen() {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [plan, setPlan] = useState<number>(2);

	const [loading, setLoading] = useState<boolean>(false);
	const [basicPlansGetResp, setBasicPlansGetResp] = useState<PlanResponse[]>([]);

	useEffect(() => {
		const handle = async () => {
			setBasicPlansGetResp(await basicPlansGet());
		};

		handle();
	}, []);

	const handlePay = async () => {
		if (plan == 2) {
			ToastAndroid.show('Choose a subscription plan', ToastAndroid.SHORT);
			return;
		}

		try {
			setLoading(true);

			const tokenResp = await basicTransactionsSubscriptionPay(plan);
			router.replace({
				pathname: '/subscription-pay-wait',
				params: { xtoken: tokenResp },
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
			<View style={styles.container}>
				<View style={styles.topRow}>
					<TouchableOpacity
						style={[styles.backCircle, { backgroundColor: colorScheme === 'dark' ? '#1c1f21' : '#eee' }]}
						onPress={() => router.back()}
					>
						<IconSymbol size={25} name="chevron-left" color={colorScheme === 'dark' ? '#525252ff' : '#b4b4b4ff'} />
					</TouchableOpacity>
					<ThemedText style={styles.headerTitle}>Subscription</ThemedText>
					<View style={{ width: 40 }} />
				</View>

				<View style={styles.iconWrap}>
					<Image source={require('@/assets/images/sub-icon-base.png')} style={{ maxWidth: 75, maxHeight: 75 }} />
				</View>

				<ThemedText style={styles.title}>Never miss a payment{'\n'}with Sub Premium</ThemedText>

				<View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#18191dff' : '#fff' }]}>
					{basicPlansGetResp?.map((planResp, id) => (
						<TouchableOpacity
							key={planResp.id}
							activeOpacity={0.9}
							style={[
								styles.optionRow,
								plan === planResp.id ? { backgroundColor: colorScheme === 'dark' ? '#131417' : '#f5f8ffff' } : null,
							]}
							onPress={() => setPlan(planResp.id)}
						>
							<View style={[styles.radio, plan === planResp.id ? styles.radioActive : null]} />
							<View style={styles.optionTextWrap}>
								<ThemedText style={styles.optionLabel}>{planResp.name}</ThemedText>
							</View>
							<ThemedText style={styles.price}>₽{planResp.price}</ThemedText>
						</TouchableOpacity>
					))}

					<Text style={styles.secureText}>Secure payments via Credit Card, Apple{'\n'}Pay, and more.</Text>
				</View>

				<View style={{ flexDirection: 'column', width: '100%', bottom: 30, position: 'absolute' }}>
					<TouchableOpacity
						disabled={loading}
						onPress={handlePay}
						activeOpacity={0.6}
						style={[
							styles.subscribeBtnWrapper,
							{
								backgroundColor: '#002958ff',
								borderWidth: 1,
								borderColor: colorScheme === 'dark' ? '#0077ffff' : '#002958ff',
								borderRadius: 14,
							},
						]}
					>
						<Text style={[styles.subscribeText, { textAlign: 'center', color: '#fff' }]}>Subscribe Now</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.6}
						style={[styles.cancelBtn, { backgroundColor: colorScheme === 'dark' ? '#16181a' : '#f5f8ffff' }]}
						onPress={() => router.back()}
					>
						<ThemedText style={styles.cancelText}>Cancel</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const MUTED = '#9aa0a6';

const styles = StyleSheet.create({
	safe: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	topRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 6,
		marginBottom: 18,
	},
	backCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	backChevron: {
		color: '#bfc6cc',
		fontSize: 22,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	iconWrap: {
		marginTop: 16,
		marginBottom: 10,
	},
	iconGrad: {
		width: 88,
		height: 88,
		borderRadius: 44,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#9de0ff',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
	},
	iconBolt: {
		fontSize: 34,
	},

	title: {
		fontSize: 20,
		fontWeight: '700',
		textAlign: 'center',
		marginTop: 8,
		lineHeight: 28,
		marginBottom: 18,
	},

	card: {
		width: '100%',
		borderRadius: 14,
		padding: 14,
		marginTop: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 2,
	},
	optionRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 10,
		borderRadius: 12,
		marginBottom: 10,
		backgroundColor: 'transparent',
	},
	radio: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: '#474b4d',
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioActive: {
		borderColor: '#8ce1ff',
		backgroundColor: '#8ce1ff33',
	},
	optionTextWrap: {
		flex: 1,
	},
	optionLabel: {
		fontSize: 16,
		fontWeight: '600',
	},
	sublabel: {
		color: MUTED,
		fontSize: 13,
		marginTop: 4,
	},
	price: {
		fontSize: 15,
		fontWeight: '600',
		marginLeft: 10,
	},
	secureText: {
		color: MUTED,
		fontSize: 12,
		textAlign: 'center',
		marginTop: 6,
		lineHeight: 16,
	},
	subscribeBtnWrapper: {
		width: '100%',
	},
	subscribeBtn: {
		width: '100%',
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 5,
	},
	subscribeText: {
		fontSize: 16,
		fontWeight: '700',
		paddingVertical: 14,
		alignItems: 'center',
		width: '100%',
	},
	cancelBtn: {
		width: '100%',
		marginTop: 12,
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
	},
	cancelText: {
		fontSize: 15,
		fontWeight: '600',
	},
});
