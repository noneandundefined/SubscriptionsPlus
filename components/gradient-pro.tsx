import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

export default function GradientPro() {
	const colorScheme = useColorScheme();

	const circleSize = 500;

	return (
		<View style={styles.container}>
			{/* большие размытые круги разных цветов */}
			<View style={[styles.glow, { backgroundColor: 'rgba(255, 0, 128, 0.4)', top: -40, left: -40 }]} />
			<View style={[styles.glow, { backgroundColor: 'rgba(255, 102, 0, 0.4)', top: 20, right: -40 }]} />
			<View style={[styles.glow, { backgroundColor: 'rgba(255, 230, 0, 0.4)', bottom: -30 }]} />

			{/* белый круг сверху */}
			<View style={styles.circle} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	glow: {
		position: 'absolute',
		width: 250,
		height: 250,
		borderRadius: 125,
	},
	circle: {
		width: 180,
		height: 180,
		borderRadius: 90,
		backgroundColor: '#fff',
	},
});
