import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorageService {
	private static TOKEN_KEY = 's+sub+scret_key+key[authToken]';
	private static REFRESH_TOKEN_KEY = 's+sub+scret_key+key[authToken]-refresh';

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

	async getRefreshToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(AuthStorageService.REFRESH_TOKEN_KEY);
		} catch {
			return null;
		}
	}

	async setRefreshToken(token: string): Promise<void> {
		try {
			await AsyncStorage.setItem(AuthStorageService.REFRESH_TOKEN_KEY, token);
		} catch (e) {}
	}

	async removeRefreshToken(): Promise<void> {
		try {
			await AsyncStorage.removeItem(AuthStorageService.REFRESH_TOKEN_KEY);
		} catch (e) {}
	}
}

export default new AuthStorageService();
