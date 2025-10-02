import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorageService {
	private static TOKEN_KEY = 's+sub+scret_key+key[authToken]';

	async getToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(AuthStorageService.TOKEN_KEY);
		} catch {
			return null;
		}
	}

	async setToken(token: string): Promise<void> {
		try {
			await AsyncStorage.setItem(AuthStorageService.TOKEN_KEY, token);
		} catch (e) {}
	}

	async removeToken(): Promise<void> {
		try {
			await AsyncStorage.removeItem(AuthStorageService.TOKEN_KEY);
		} catch (e) {}
	}
}

export default new AuthStorageService();
