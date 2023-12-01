import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';



const { POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, ENDPOINT_ID } = process.env;
export const { PRODUCT_VERSION, POSTGRES_DB } = <{ PRODUCT_VERSION: string, POSTGRES_DB: string }>process.env;

const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
// const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?ssl=true`;

const queryClientOptions: {
    ssl: boolean | object | "require" | "allow" | "prefer" | "verify-full" | undefined,
    connection: { options: string }
} = {
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    }
};

const migrationClientOptions: {
    max: number,
    ssl: boolean | object | "require" | "allow" | "prefer" | "verify-full" | undefined,
    connection: { options: string }
} = { max: 1, ...queryClientOptions };
export const migrationClient = postgres(POSTGRES_URL, migrationClientOptions);


const queryClient = postgres(POSTGRES_URL, queryClientOptions);
export const db = drizzle(queryClient);
