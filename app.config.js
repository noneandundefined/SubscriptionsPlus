import 'dotenv/config';

export default ({ config }) => {
	return {
		...config,
		extra: {
			apiUrl: process.env.API_URL,
			eas: {
				projectId: '9013a758-c6e2-481c-a2c6-c9a525275d24',
			},
		},
	};
};
