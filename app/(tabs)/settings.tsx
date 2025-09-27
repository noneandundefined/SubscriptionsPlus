import { SafeAreaView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
	return (
		<SafeAreaView>
			<ThemedText type="subtitle">Soon!</ThemedText>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
});
