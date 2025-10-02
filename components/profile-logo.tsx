import { useColorScheme } from '@/hooks/use-color-scheme';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ProfileLogoProps {
	email: string;
}

export const ProfileLogo: React.FC<ProfileLogoProps> = ({ email }) => {
	const colorScheme = useColorScheme();

	return (
		<TouchableOpacity activeOpacity={0.6}>
			<View
				style={{
					padding: 10,
					margin: 15,
					borderRadius: 500,
					backgroundColor: colorScheme === 'dark' ? '#092341ff' : '#f9f9f9',
					borderWidth: 1,
					borderColor: colorScheme === 'dark' ? '#0077ffff' : '#dfdfdfff',
					alignSelf: 'flex-end',
					width: 45,
					height: 45,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ThemedText>{email.charAt(0).toUpperCase()}</ThemedText>
			</View>
		</TouchableOpacity>
	);
};
