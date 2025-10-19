import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { SubscriptionEmpty } from '@/components/subscription-empty';
import { SubscriptionItem } from '@/components/subscription-item';
import { useCallback, useEffect, useState } from 'react';

import { ProfileLogo } from '@/components/profile-logo';
import { SearchSubInput } from '@/components/search-sub';
import { SubscriptionPayNotify } from '@/components/subscription-pay-notify';
import SubscriptionStatusPay from '@/components/subscription-status-pay';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHandleServer } from '@/hooks/use-handle-server';
import { basicNotifyToken } from '@/rest/notificationAPI';
import { basicSubscriptionDeleteById, basicSubscriptionsGet } from '@/rest/subscriptionAPI';
import { basicTransactionsSubscriptionPending } from '@/rest/transactionAPI';
import { basicUserMe } from '@/rest/userAPI';
import { getGreeting } from '@/utils/GreetingUtils';
import { registerForPushNotificationsAsync } from '@/utils/NotificationUtils';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
	const colorScheme = useColorScheme();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const { data: basicUserMeResp, reload: reloadUserMe } = useHandleServer(['basicUserMeResp'], basicUserMe);

	const { data: basicTransactionsSubscriptionPendingResp, reload: reloadSubPending } = useHandleServer(
		['basicTransactionsSubscriptionPendingResp'],
		basicTransactionsSubscriptionPending
	);

	useFocusEffect(
		useCallback(() => {
			reloadUserMe();
			reloadSubPending();
		}, [])
	)

	const {
		data: basicSubscriptionsGetResp,
		loading,
		reload,
	} = useHandleServer(['basicSubscriptionsGetResp', searchQuery], () => basicSubscriptionsGet(searchQuery));

	useEffect(() => {
		registerForPushNotificationsAsync().then(async token => {
			if (token) {
				await basicNotifyToken(token);
			}
		});
	}, []);

	const handleDelete = async (id: number) => {
		await basicSubscriptionDeleteById(id);
		reload();
	};

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
				}}
			>
				<ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#eee' }} edges={['top', 'left', 'right']}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				{/* Subscription user */}
				<FlatList
					data={basicSubscriptionsGetResp}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => <SubscriptionItem sub={item} onDelete={() => handleDelete(item.id)} />}
					ListEmptyComponent={<SubscriptionEmpty />}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
					refreshing={loading}
					onRefresh={reload}
					ListHeaderComponent={
						<>
							{/* Logo profile user */}
							<ProfileLogo user={basicUserMeResp} />

							{basicSubscriptionsGetResp && (
								<View style={styles.text_hi_view}>
									<ThemedText style={styles.text_hi_title}>{getGreeting()}</ThemedText>
									<Text
										style={[
											styles.text_hi_desc,
											{
												color: colorScheme === 'dark' ? '#999' : '#999',
											},
										]}
									>
										time to manage your subscriptions.
									</Text>
								</View>
							)}

							{/* Search */}
							<SearchSubInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} colorScheme={colorScheme} />

							{/* Notify for pay subscription */}
							{!basicUserMeResp?.is_active && (
								<View style={{ maxWidth: '100%' }}>
									{basicTransactionsSubscriptionPendingResp ? (
										<View>
											<SubscriptionStatusPay transaction={basicTransactionsSubscriptionPendingResp} />
										</View>
									) : (
										<SubscriptionPayNotify />
									)}
								</View>
							)}

							<View style={{ marginVertical: 15, marginHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<ThemedText style={{ fontWeight: 500, fontSize: 17 }}>Subscriptions <Text style={{ fontWeight: 400, fontSize: 13 }}>({basicSubscriptionsGetResp?.length})</Text></ThemedText>

								<ThemedText style={{ fontWeight: 500, fontSize: 17 }}>₽ {basicSubscriptionsGetResp?.reduce((sum, sub) => sum + sub.price, 0)} <Text style={{ fontSize: 14, color: "#999", fontWeight: 400 }}>/ month</Text></ThemedText>
							</View>
						</>
					}
				/>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	text_hi_view: {
		maxWidth: Math.min(screenWidth * 0.68, 300),
		flexDirection: 'column',
		gap: 7,
		marginBottom: 30,
		marginLeft: 15,
	},
	text_hi_title: {
		fontSize: 35,
		fontWeight: 500,
		letterSpacing: 0.6,
		lineHeight: 40,
		includeFontPadding: true,
	},
	text_hi_desc: {
		letterSpacing: 0.4,
		fontSize: 25,
		fontWeight: 400,
	},
	total_price: {
		padding: 7,
		fontSize: 12,
		borderRadius: 20,
		alignSelf: 'flex-start',
		minWidth: 80,
		marginTop: 10,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
});
