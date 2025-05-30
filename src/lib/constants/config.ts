import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL_HPBASE: z.string(), // https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-mysql#connecting-your-database
	DATABASE_URL_PROPOSALS: z.string(), // https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-mysql#connecting-your-database
	NEXTAUTH_SECRET: z.string(), // Run on gitbash: openssl rand -base64 32
	NEXT_PUBLIC_URL: z
		.string()
		.url()
		.regex(/^https?:\/\//, "URL must begin with http:// or https://"), // http://localhost:3000
	NEXTAUTH_URL: z
		.string()
		.url()
		.regex(/^https?:\/\//), // http://localhost:3000
	NEXT_PUBLIC_CONTACT_EMAIL: z.string().email(), // any email address
	NEXT_PUBLIC_MAINTENANCE_MODE: z.string(), // false/true
	SALT_ROUNDS: z.coerce.number().int().min(0).max(30).default(10), // number of rounds to hash the password, if the number is too high it'll be slow (Preference: 10)
	NOREPLY_HOST: z.string(), // smtp host
	NOREPLY_PORT: z.string().max(5), // smtp host port
	NOREPLY_EMAIL: z.string().email(), // email address
	NOREPLY_PASSWORD: z.string(), // email password
	STORAGE_PATH: z.string(), // storage path
	NEXT_PUBLIC_AZURE_STORAGE_URL: z.string().url(), // https://example.blob.core.windows.net/container
	AZURE_STORAGE_CONNECTION_STRING: z.string(), // Azure Storage connection string
	AZURE_STORAGE_ACCOUNT_NAME: z.string(), // Azure Storage account name
	AZURE_STORAGE_ACCOUNT_KEY: z.string(), // Azure Storage account key
});

const env = envSchema.parse({
	DATABASE_URL_HPBASE: process.env.DATABASE_URL_HPBASE,
	DATABASE_URL_PROPOSALS: process.env.DATABASE_URL_PROPOSALS,
	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
	NEXTAUTH_URL: process.env.NEXTAUTH_URL,
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
	NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
	SALT_ROUNDS: process.env.SALT_ROUNDS,
	NOREPLY_HOST: process.env.NOREPLY_HOST,
	NOREPLY_PORT: process.env.NOREPLY_PORT,
	NOREPLY_EMAIL: process.env.NOREPLY_EMAIL,
	NOREPLY_PASSWORD: process.env.NOREPLY_PASSWORD,
	STORAGE_PATH: process.env.STORAGE_PATH,
	NEXT_PUBLIC_AZURE_STORAGE_URL: process.env.NEXT_PUBLIC_AZURE_STORAGE_URL,
	AZURE_STORAGE_CONNECTION_STRING:
		process.env.AZURE_STORAGE_CONNECTION_STRING,
	AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
	AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY,
});

const serverEnv = {
	DATABASE_URL_HPBASE: env.DATABASE_URL_HPBASE,
	DATABASE_URL_PROPOSALS: env.DATABASE_URL_PROPOSALS,
	NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
	NEXTAUTH_URL: env.NEXTAUTH_URL,
	NEXT_PUBLIC_URL: env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_CONTACT_EMAIL: env.NEXT_PUBLIC_CONTACT_EMAIL,
	SALT_ROUNDS: env.SALT_ROUNDS,
	NOREPLY_HOST: env.NOREPLY_HOST,
	NOREPLY_PORT: env.NOREPLY_PORT,
	NOREPLY_EMAIL: env.NOREPLY_EMAIL,
	NOREPLY_PASSWORD: env.NOREPLY_PASSWORD,
	STORAGE_PATH: env.STORAGE_PATH,
	NEXT_PUBLIC_AZURE_STORAGE_URL: env.NEXT_PUBLIC_AZURE_STORAGE_URL,
	AZURE_STORAGE_CONNECTION_STRING: env.AZURE_STORAGE_CONNECTION_STRING,
	AZURE_STORAGE_ACCOUNT_NAME: env.AZURE_STORAGE_ACCOUNT_NAME,
	AZURE_STORAGE_ACCOUNT_KEY: env.AZURE_STORAGE_ACCOUNT_KEY,
};

const clientEnv = {
	NEXT_PUBLIC_URL: env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_CONTACT_EMAIL: env.NEXT_PUBLIC_CONTACT_EMAIL,
	NEXT_PUBLIC_MAINTENANCE_MODE: env.NEXT_PUBLIC_MAINTENANCE_MODE,
	NEXT_PUBLIC_AZURE_STORAGE_URL: env.NEXT_PUBLIC_AZURE_STORAGE_URL,
};

envSchema.parse({
	...serverEnv,
	...clientEnv,
});

export { clientEnv, serverEnv };
