// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: "./components/ui",
    },

    components: {
        global: true,
        dirs: ["~/components"],
    },

    nitro: {
        preset: "netlify",
        routeRules: {
            "/api/**": {
                cors: true,
                headers: {
                    "Access-Control-Allow-Methods":
                        "GET,HEAD,PUT,PATCH,POST,DELETE",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            },
        },
    },

    runtimeConfig: {
        openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
        assistantId: "",
    },

    compatibilityDate: "2024-07-05",
    telemetry: false,
});
