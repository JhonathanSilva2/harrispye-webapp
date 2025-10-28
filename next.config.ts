// import { withSentryConfig } from "@sentry/nextjs"; // Sentry desativado
import type { NextConfig } from "next";
import path from "path";

const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
    webpack(config, { isServer }) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "src"),
        };
        config.module.rules.push({
            test: /\.node$/,
            type: "asset/resource",
            generator: { filename: "static/chunks/[name][ext]" },
        });
        if (isServer) {
            config.cache = false;
        }
        return config;
    },
    productionBrowserSourceMaps: false, // Desativado para produção
    logging: {
        fetches: {
            hmrRefreshes: true,
            fullUrl: true,
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "brdev22.blob.core.windows.net",
            },
            {
                protocol: "https",
                // A '!' assume que NEXT_PUBLIC_URL estará definido em produção.
                // Considerar um valor default se puder ser undefined.
                hostname: process.env.NEXT_PUBLIC_URL!.replace(
                    /^https?:\/\//,
                    "",
                ),
                port: "",
                pathname: "/api/storage/**",
            },
        ],
    },
    reactStrictMode: true,
    experimental: {
        authInterrupts: true,
        serverActions: {
            bodySizeLimit: "100mb",
        },
    },
    env: {
        DATABASE_URL_HPBASE: process.env.DATABASE_URL_HPBASE,
        DATABASE_URL_PROPOSALS: process.env.DATABASE_URL_PROPOSALS,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
        NOREPLY_HOST: process.env.NOREPLY_HOST,
        NOREPLY_PORT: process.env.NOREPLY_PORT,
        NOREPLY_EMAIL: process.env.NOREPLY_EMAIL,
        NOREPLY_PASSWORD: process.env.NOREPLY_PASSWORD,
        STORAGE_PATH: process.env.STORAGE_PATH,
        COMPANY_ACRONYM: process.env.COMPANY_ACRONYM,
        NEXT_PUBLIC_AZURE_STORAGE_URL:
            process.env.NEXT_PUBLIC_AZURE_STORAGE_URL,
        AZURE_STORAGE_CONNECTION_STRING:
            process.env.AZURE_STORAGE_CONNECTION_STRING,
        AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY,
        // Variáveis Sentry mantidas no env, mas não usadas se Sentry desativado
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
        SENTRY_DSN: process.env.SENTRY_DSN,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        CI: process.env.CI,
        DEVELOPMENT_BRAZIL_EMAIL: process.env.DEVELOPMENT_BRAZIL_EMAIL,
        PROJECTS_BRAZIL_EMAIL: process.env.PROJECTS_BRAZIL_EMAIL,
    },
};

// --- Bloco Sentry Desativado ---
// export default withSentryConfig(
//   nextConfig,
//   {
//     org: "azuri-tech",
//     project: "harrispye-az-next",
//     silent: isCI,
//     widenClientFileUpload: true,
//     tunnelRoute: "/monitoring",
//     disableLogger: true,
//     automaticVercelMonitors: true,
//   }
// );
// --- Fim do Bloco Sentry Desativado ---

export default nextConfig; // Exporta a configuração normal do Next.js
