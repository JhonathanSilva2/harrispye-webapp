import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
    webpack(config, { isServer }) {
        /**
         * Lets you import with import Foo from "@/components/Foo" instead of long relative paths.
         */
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "src"),
        };
        /**
         * Tells Webpack to emit any .node (binary addon) files as separate assets under /_next/static/chunks/,
         * so your server bundle can load them at runtime.
         */
        config.module.rules.push({
            test: /\.node$/,
            type: "asset/resource",
            generator: { filename: "static/chunks/[name][ext]" },
        });
        /**
         * Disable cache on the server build
         */
        if (isServer) {
            config.cache = false;
        }
        return config;
    },
    output: "standalone",
    productionBrowserSourceMaps: false,
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
                port: "3000",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "brdev22.blob.core.windows.net",
            },
            {
                protocol: "https",
                hostname: process.env.NEXT_PUBLIC_URL!.replace(
                    /^https?:\/\//,
                    "",
                ),
                port: "",
                pathname: "/api/storage/**",
            },
        ],
    },
    reactStrictMode: true, // Disable when you thinks your component is re-rendering too much
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode
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
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
        SENTRY_DSN: process.env.SENTRY_DSN,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        CI: process.env.CI,
    },
};

export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "azuri-tech",
    project: "harrispye-az-next",

    // Only print logs for uploading source maps in CI
    silent: isCI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
});
