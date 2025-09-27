import { Subscription } from '@/interfaces/SubscriptionInterface';
import { FileUtils } from '@/utils/FileUtils';

class SubscriptionService {
	private fileUtils: FileUtils;

	constructor() {
		this.fileUtils = new FileUtils('subscriptions.json');
	}

	public async getAll(): Promise<Subscription[]> {
		return await this.fileUtils.readJSON<Subscription[]>();
	}

	public async getById(id: number): Promise<Subscription | null> {
		const subs = await this.getAll();
		return subs.find((sub) => sub.id === id) || null;
	}

	public async add(sub: Subscription): Promise<void> {
		const subs = await this.getAll();
		subs.push(sub);

		await this.fileUtils.writeJSON(subs);
	}

	public async update(sub: Subscription): Promise<void> {
		let subs = await this.getAll();
		subs = subs.map((s) => (s.id === sub.id ? sub : s));

		await this.fileUtils.writeJSON(subs);
	}

	public async del(id: number): Promise<void> {
		let subs = await this.getAll();
		subs = subs.filter((sub) => sub.id !== id);

		await this.fileUtils.writeJSON(subs);
	}
}

export default new SubscriptionService();
