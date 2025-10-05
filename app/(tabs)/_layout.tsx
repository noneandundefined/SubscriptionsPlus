import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthStorageService from '@/services/AuthStorageService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [queryClient] = useState(() => new QueryClient());
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const init = async () => {
			const token = await AuthStorageService.getToken();

			setLoading(false);

			if (!token) {
				router.replace('/user-create');
			}
		};

		init();
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
		<QueryClientProvider client={queryClient}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarStyle: {
						height: 65,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
					}}
				/>
				<Tabs.Screen
					name="add"
					options={{
						title: 'Add',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="add" color={color} />,
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						title: 'Settings',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings.fill" color={color} />,
					}}
				/>
			</Tabs>
		</QueryClientProvider>
	);
}
