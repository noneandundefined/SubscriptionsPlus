import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from "expo-notifications";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from "react-native";
import 'react-native-css-interop';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("subscriptions", {
			name: "Subscription reminders",
			importance: Notifications.AndroidImportance.HIGH,
			sound: "default",
		});
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="edit"
					options={{
						presentation: 'formSheet',
						headerShown: false,
						contentStyle: {
							backgroundColor: colorScheme === "dark" ? "#000" : "#eee"
						}
					}}
				/>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
