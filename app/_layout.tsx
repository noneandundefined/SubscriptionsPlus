import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthStorageService from '@/services/AuthStorageService';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-css-interop';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const init = async () => {
			const token = await AuthStorageService.getToken();
			console.log(token)

			setLoading(false);

			if (!token) {
				router.push('/user-create');
			}
		};

		init();
	}, []);

	useEffect(() => {
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('subscriptions', {
				name: 'Subscription reminders',
				importance: Notifications.AndroidImportance.HIGH,
				sound: 'default',
			});
		}
	}, []);

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
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="user-create" options={{
					headerShown: false, contentStyle: {
						backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
					},
				}} />
				<Stack.Screen
					name="edit"
					options={{
						presentation: 'formSheet',
						headerShown: false,
						contentStyle: {
							backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
						},
					}}
				/>
				<Stack.Screen
					name="subscription-pay"
					options={{
						presentation: 'formSheet',
						// headerShown: false,
						contentStyle: {
							backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
						},
					}}
				/>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
