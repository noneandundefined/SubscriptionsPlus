import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-css-interop';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	const [queryClient] = useState(() => new QueryClient());

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('subscriptions', {
			name: 'Subscription reminders',
			importance: Notifications.AndroidImportance.HIGH,
			sound: 'default',
		});
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<QueryClientProvider client={queryClient}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="user-create"
						options={{
							headerShown: false,
							contentStyle: {
								backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
							},
						}}
					/>
					<Stack.Screen
						name="user-restore-access"
						options={{
							headerShown: false,
							contentStyle: {
								backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
							},
						}}
					/>
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
							headerShown: false,
							contentStyle: {
								backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
							},
						}}
					/>
					<Stack.Screen
						name="subscription-pay-wait"
						options={{
							presentation: 'formSheet',
							headerShown: false,
							contentStyle: {
								backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
							},
						}}
					/>
					<Stack.Screen
						name="transactions"
						options={{
							presentation: 'formSheet',
							headerShown: false,
							contentStyle: {
								backgroundColor: colorScheme === 'dark' ? '#000' : '#eee',
							},
						}}
					/>
				</Stack>
				<StatusBar style="auto" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
