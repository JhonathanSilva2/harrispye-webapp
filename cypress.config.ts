import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
        setupNodeEvents(on, config) {
            // event listeners aqui, se precisar
        },
    },
});
