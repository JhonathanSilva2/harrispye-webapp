import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.config({
        extends: ["next"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
        },
        overrides: [
            {
                files: ["**/*.test.tsx", "**/*.test.ts"],
                plugins: ["jest"],
                env: {
                    "jest/globals": true,
                },
                rules: {
                    "@typescript-eslint/no-explicit-any": "off",
                    "@next/next/no-img-element": "off",
                },
            },
        ],
    }),
];

export default eslintConfig;
