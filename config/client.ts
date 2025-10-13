import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const APPKEY_TOKEN = Constants.expoConfig?.extra?.appKeyServer;

export default { API_URL, APPKEY_TOKEN };
