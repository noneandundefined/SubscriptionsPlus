import 'dotenv/config';

export default ({ config }) => {
	return {
		...config,
		extra: {
			apiUrl: process.env.API_URL || 'https://subscriptionplus.online/api/v1',
			appKeyServer: process.env.APPKEY_TOKEN || 'SUBS_pluS@PpKey-7x9q2rM8ZtF5w0',
			eas: {
				projectId: '9013a758-c6e2-481c-a2c6-c9a525275d24',
			},
		},
	};
};
