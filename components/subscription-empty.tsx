import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const SubscriptionEmpty = () => {
	const colorScheme = useColorScheme();

	const boxWidth = Math.min(screenWidth * 0.8, 300);
	const boxHeight = 250;

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colorScheme === 'dark' ? 'transparent' : 'transparent',
				},
			]}
		>
			<View
				style={[
					styles.box,
					{
						width: boxWidth,
						height: boxHeight,
						backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#fff',
						borderWidth: 1,
						borderColor: colorScheme === 'dark' ? '#444' : '#f1f1f1',
						transform: [{ translateX: -boxWidth / 2 }, { translateY: -boxHeight / 2 }],
					},
				]}
			>
				<Image source={require('../assets/images/sub-icon-base.png')} resizeMode="contain" style={styles.img} />
				<Text
					style={[
						styles.text_empty,
						{
							color: colorScheme === 'dark' ? '#555' : '#999',
						},
					]}
				>
					You don’t have any subscriptions yet. Add your first one to see it here!
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	box: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 15,
		borderRadius: 10,
	},
	img: {
		width: 90,
		height: 90,
		opacity: 0.45,
	},
	text_empty: {
		textAlign: 'center',
		padding: 14,
		marginTop: 12,
		fontSize: 13,
	},
});
