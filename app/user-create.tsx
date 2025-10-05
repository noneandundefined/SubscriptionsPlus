import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { basicAuthCreate } from '@/rest/authAPI';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function UserCreateScreen() {
	const router = useRouter();
	const colorScheme = useColorScheme();

	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleCreate = async () => {
		try {
			setLoading(true);
			await basicAuthCreate(email);

			router.replace('/');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			Toast.show({
				type: 'success',
				text1: 'Hello 👋',
				text2: 'Toasыt is working!',
			});
		}, 3000);
	}, []);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#eee' }]}>
			<View style={styles.inner}>
				<Image source={require('@/assets/images/sub-icon-base.png')} style={{ maxWidth: 100, maxHeight: 100, marginBottom: 30 }} />

				<ThemedText type="title" style={styles.title}>
					Create your account
				</ThemedText>

				<TextInput
					value={email}
					onChangeText={(text) => setEmail(text)}
					style={{
						color: colorScheme === 'dark' ? '#fff' : '#000',
						width: '100%',
						backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
						borderWidth: 1,
						marginHorizontal: 10,
						marginBottom: 15,
						fontSize: 15,
						borderRadius: 13,
						height: 55,
						paddingHorizontal: 15,
						borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
					}}
					placeholder="Write here your email"
					placeholderTextColor={colorScheme === 'dark' ? '#949494ff' : '#949494ff'}
				/>

				<TouchableOpacity
					onPress={handleCreate}
					style={[styles.button, { backgroundColor: colorScheme === 'dark' ? '#fff' : '#000' }]}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color={colorScheme === 'dark' ? '#000' : '#fff'} />
					) : (
						<Text style={[styles.buttonText, { color: colorScheme === 'dark' ? '#000' : '#fff' }]}>Create</Text>
					)}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inner: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 20,
		justifyContent: 'center',
	},
	logo: {
		width: 60,
		height: 60,
		marginBottom: 20,
		resizeMode: 'contain',
	},
	title: {
		fontSize: 25,
		fontWeight: '600',
		marginBottom: 30,
	},
	input: {
		width: '100%',
		borderWidth: 1,
		borderRadius: 10,
		height: 50,
		paddingHorizontal: 15,
		marginBottom: 15,
		fontSize: 16,
	},
	button: {
		width: '100%',
		borderRadius: 10,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
