import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		DATABASE_URL_UNPOOLED: z.string().min(1),
		POSTGRES_URL: z.string().min(1),
		POSTGRES_URL_NON_POOLING: z.string().min(1),
		POSTGRES_USER: z.string().min(1),
		POSTGRES_HOST: z.string().min(1),
		POSTGRES_PASSWORD: z.string().min(1),
		POSTGRES_DATABASE: z.string().min(1),
		POSTGRES_URL_NO_SSL: z.string().min(1),
		POSTGRES_PRISMA_URL: z.string().min(1),
		AUTH_GITHUB_ID: z.string().min(1),
		AUTH_GITHUB_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		PUSHER_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_PUSHER_APP_ID: z.string().min(1),
		NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
		NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
		NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
		NEXT_PUBLIC_PUSHER_APP_ID: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
	},
});
