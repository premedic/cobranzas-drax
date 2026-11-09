const env = {
	NODE_ENV: 'production',
	HOST: '0.0.0.0',

	// JWT
	DRAX_JWT_SECRET: '',
	DRAX_JWT_EXPIRATION: '24h',
	DRAX_JWT_ISSUER: 'DRAX',
	DRAX_APIKEY_SECRET: '',
	DRAX_DEFAULT_ROLE: 'Operator',

	// DB
	DRAX_DB_ENGINE: 'mongo',
	DRAX_MONGO_URI: '',

	// APP
	DRAX_PORT: '8080',
	DRAX_BASE_URL: '',

	// MEDIA
	DRAX_MAX_UPLOAD_SIZE: '50000000',
	DRAX_FILE_DIR: 'uploads',
	DRAX_FILE_METADATA: 'true',

	// Portal de comprobantes (URL base, sin /api)
	TRANSFER_RECEIPT_PORTAL_URL: '',
	TRANSFER_RECEIPT_PORTAL_API_KEY: '',

	// IA
	AI_PROVIDER: 'GoogleAi',
	OPENAI_API_KEY: '',
	OPENAI_MODEL: 'gpt-4o',
	GOOGLE_AI_API_KEY: '',
	GOOGLE_AI_MODEL: 'models/gemini-3-flash-preview',

	// Google SSO
	GOOGLE_CLIENT_ID: '',

	// EMAIL
	EMAIL_TYPE: 'gmail',
	EMAIL_AUTH_USERNAME: '',
	EMAIL_AUTH_PASSWORD: '',

	// MULTICHANNEL
	MULTICHANNEL_ENDPOINT_URL: 'https://multicapi.sondeosglobal.com/webServiceMessage',
	MULTICHANNEL_API_KEY: '',
	MULTICHANNEL_MESSENGER_NUMBER: '5491136669639',

	//RECOVERY
	RECOVERY_ENABLED: 'true',
	RECOVERY_NAME: '',
	RECOVERY_MASTER_PASSWORD: '',
	RECOVERY_MAX_UPLOAD_BYTES: '5368709120'
};

module.exports = {
	apps: [
		{
			name: 'COBRANZAS-DRAX API',
			script: './out/index.js',
			instances: 1,
			env,
		},
		{
			name: 'COBRANZAS-DRAX JOBS',
			script: './out/index-jobs.js',
			instances: 1,
			env,
		},
	],
};
