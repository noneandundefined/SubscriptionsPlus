import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
	if (!Device.isDevice) {
		alert('Push notifications require a physical device');
		return null;
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		alert('Permission not granted!');
		return null;
	}

	const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
	const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

	console.log('Expo Push Token:', token);
	return token;
};
