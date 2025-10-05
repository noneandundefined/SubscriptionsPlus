import { SubscriptionPayNotifyRow } from '@/components/subscription-pay-notify-row';
import SubscriptionStatusPay from '@/components/subscription-status-pay';
import { ThemedText } from '@/components/themed-text';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicAuthDelete } from '@/rest/authAPI';
import { basicTransactionsSubscriptionPending } from '@/rest/transactionAPI';
import { basicUserMe } from '@/rest/userAPI';
import { formatDateUS } from '@/utils/DayUtils';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const { data: basicUserMeResp } = useHandleServer(['basicUserMeResp'], basicUserMe);
	const { data: basicTransactionsSubscriptionPendingResp } = useHandleServer(
		['basicTransactionsSubscriptionPendingResp'],
		basicTransactionsSubscriptionPending
	);

	return (
		<SafeAreaView style={{ flex: 1 }}>
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

				<TouchableOpacity style={{ gap: 10 }} onPress={() => basicAuthDelete()}>
					<Text style={{ color: '#777', fontSize: 15 }}>Account delete</Text>
					<ThemedText style={{ color: "#920e0eff" }}>I want to delete my account.</ThemedText>
					<View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.push('/transactions')} style={{ alignSelf: 'center', marginTop: 10 }}>
					<Text style={{ color: "#818181ff", fontSize: 15 }}>Go to transactions</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SettingsScreen;
