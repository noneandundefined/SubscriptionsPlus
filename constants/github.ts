import RNFS from 'react-native-fs';

export const GITHUB_RELEASES_API = 'https://api.github.com/repos/noneandundefined/SubscriptionsPlus/releases/latest';
export const APK_DOWNLOAD_URL = 'https://github.com/noneandundefined/SubscriptionsPlus/releases/latest/download/SubscriptionPlus.apk';
export const APK_PATH = `${RNFS.DownloadDirectoryPath}/update.apk`;
