import { ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

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
import { basicSubscriptionDeleteById, basicSubscriptionsGet } from '@/rest/subscriptionAPI';
import { basicTransactionsSubscriptionPending } from '@/rest/transactionAPI';
import { basicUserMe } from '@/rest/userAPI';
import { getGreeting } from '@/utils/GreetingUtils';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

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
		const requestPermissions = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission for notifications not granted!');
			}
		};

		requestPermissions();
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
								<View
									style={[
										styles.total_price,
										{
											backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
											borderWidth: 1,
											borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
										},
									]}
								>
									<ThemedText style={{ fontSize: 14, textAlign: 'center' }}>
										{basicSubscriptionsGetResp.reduce((sum, sub) => sum + sub.price, 0)}
									</ThemedText>
								</View>
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
					</>
				}
			/>
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
