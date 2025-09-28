import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-css-interop';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

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
