import { useColorScheme } from '@/hooks/use-color-scheme';
import { userMeResponse } from '@/rest/userAPI';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ProfileLogoProps {
	user: userMeResponse | null;
}

export const ProfileLogo: React.FC<ProfileLogoProps> = ({ user }) => {
	const colorScheme = useColorScheme();

	return (
		<TouchableOpacity activeOpacity={0.6}>
			<View
				style={{
					padding: 10,
					margin: 15,
					borderRadius: 500,
					backgroundColor: user?.is_active
						? colorScheme === 'dark'
							? '#092341ff'
							: '#cbd9e9ff'
						: colorScheme === 'dark'
							? '#1d1d1dff'
							: '#f9f9f9',
					borderWidth: 1,
					borderColor: user?.is_active
						? colorScheme === 'dark'
							? '#0077ffff'
							: '#abd1fdff'
						: colorScheme === 'dark'
							? '#444'
							: '#dfdfdfff',
					alignSelf: 'flex-end',
					width: 45,
					height: 45,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ThemedText>{user?.email ? user.email.charAt(0).toUpperCase() : '?'}</ThemedText>
			</View>
		</TouchableOpacity>
	);
};
