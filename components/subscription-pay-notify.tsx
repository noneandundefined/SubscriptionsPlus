import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SubscriptionPayNotify() {
	const router = useRouter();
	const colorScheme = useColorScheme();

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={{
				backgroundColor: '#092341ff',
				borderWidth: 1,
				borderColor: colorScheme === 'dark' ? '#0077ffff' : '#002958ff',
				paddingHorizontal: 17,
				borderRadius: 25,
				margin: 4,
				marginHorizontal: 10,
			}}
			onPress={() => router.push('/subscription-pay')}
		>
			<SafeAreaView style={[styles.content, { marginTop: -20 }]}>
				<Image source={require('@/assets/images/sub-icon-base.png')} style={{ maxWidth: 60, maxHeight: 60, borderRadius: 15 }} />

				<View style={{ width: 1, height: 57, backgroundColor: '#eee', marginHorizontal: 7, marginLeft: 20 }} />

				<View style={{ gap: 4 }}>
					<Text style={{ fontSize: 12, color: '#ccc' }}>Get full access</Text>
					<Text style={{ fontSize: 16, color: '#fff' }}>Register now, no limits.</Text>
					<Text style={{ fontSize: 13, color: '#ccc' }}>99 RUB.</Text>
				</View>
			</SafeAreaView>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
});
