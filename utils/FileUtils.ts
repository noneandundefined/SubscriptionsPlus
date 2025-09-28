import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export class FileUtils {
	private path: string;
	private filename: string;

	constructor(filename: string) {
		this.filename = filename;

		switch (Platform.OS) {
			case 'web':
				this.path = filename;
				break;

			default:
				this.path = (FileSystem as any).documentDirectory + 'SubscriptionPlus/' + filename;
				break;
		}
	}

	private async initial(defaultContent: any = []): Promise<void> {
		switch (Platform.OS) {
			case 'web':
				const exists = localStorage.getItem(this.filename);
				if (!exists) {
					localStorage.setItem(this.filename, JSON.stringify(defaultContent));
				}

				break;

			default:
				const dir = (FileSystem as any).documentDirectory + 'SubscriptionPlus';
				const dirInfo = await FileSystem.getInfoAsync(dir);
				if (!dirInfo.exists) {
					await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
				}

				const fileInfo = await FileSystem.getInfoAsync(this.path);
				if (!fileInfo.exists) {
					await FileSystem.writeAsStringAsync(this.path, JSON.stringify(defaultContent));
				}

				break;
		}
	}

	public async readJSON<T>(): Promise<T> {
		await this.initial();

		switch (Platform.OS) {
			case 'web':
				const contentWeb = localStorage.getItem(this.filename);
				return contentWeb ? (JSON.parse(contentWeb) as T) : ([] as T);

			default:
				const contentMobile = await FileSystem.readAsStringAsync(this.path);
				return JSON.parse(contentMobile) as T;
		}
	}

	public async writeJSON<T>(data: T): Promise<void> {
		switch (Platform.OS) {
			case 'web':
				localStorage.setItem(this.filename, JSON.stringify(data));
				break;

			default:
				await FileSystem.writeAsStringAsync(this.path, JSON.stringify(data, null, 2));
				break;
		}
	}
}
