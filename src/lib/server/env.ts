import { building } from '$app/environment';
import {
	STRIPE_SECRET_KEY,
	STRIPE_WEBHOOK_SECRET,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	RESEND_API_KEY
} from '$env/static/private';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_CLOUDINARY_CLOUD_NAME
} from '$env/static/public';

interface EnvConfig {
	stripe: {
		secretKey: string;
		webhookSecret: string;
	};
	cloudinary: {
		cloudName: string;
		apiKey: string;
		apiSecret: string;
	};
	resend: {
		apiKey: string;
	};
	supabase: {
		url: string;
		anonKey: string;
	};
}

function validateEnv(): EnvConfig {
	// Skip validation during build
	if (building) {
		return {} as EnvConfig;
	}

	const errors: string[] = [];

	// Required for payments
	if (!STRIPE_SECRET_KEY) errors.push('STRIPE_SECRET_KEY is required');
	if (!STRIPE_WEBHOOK_SECRET) errors.push('STRIPE_WEBHOOK_SECRET is required');

	// Required for media uploads
	if (!PUBLIC_CLOUDINARY_CLOUD_NAME) errors.push('PUBLIC_CLOUDINARY_CLOUD_NAME is required');
	if (!CLOUDINARY_API_KEY) errors.push('CLOUDINARY_API_KEY is required');
	if (!CLOUDINARY_API_SECRET) errors.push('CLOUDINARY_API_SECRET is required');

	// Required for emails
	if (!RESEND_API_KEY) errors.push('RESEND_API_KEY is required');

	// Required for auth/database
	if (!PUBLIC_SUPABASE_URL) errors.push('PUBLIC_SUPABASE_URL is required');
	if (!PUBLIC_SUPABASE_ANON_KEY) errors.push('PUBLIC_SUPABASE_ANON_KEY is required');

	if (errors.length > 0) {
		console.error('Environment validation failed:');
		errors.forEach((error) => console.error(`  - ${error}`));
		throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
	}

	return {
		stripe: {
			secretKey: STRIPE_SECRET_KEY,
			webhookSecret: STRIPE_WEBHOOK_SECRET
		},
		cloudinary: {
			cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
			apiKey: CLOUDINARY_API_KEY,
			apiSecret: CLOUDINARY_API_SECRET
		},
		resend: {
			apiKey: RESEND_API_KEY
		},
		supabase: {
			url: PUBLIC_SUPABASE_URL,
			anonKey: PUBLIC_SUPABASE_ANON_KEY
		}
	};
}

export const env = validateEnv();
