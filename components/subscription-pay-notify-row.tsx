import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';

export function SubscriptionPayNotifyRow() {
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
				<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 14, color: '#fff' }}>Subscription Premium</Text>
					<IconSymbol size={28} name="chevron-right" color="#fff" />
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
