import { Buffer } from "buffer";
import OpenAI from "openai";
import type { Uploadable } from "openai/uploads.mjs";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const openai = new OpenAI({
        apiKey: config.openaiApiKey,
    });

    try {
        const { base64Image, prompt } = await readBody(event);

        // Convert base64 to Buffer
        const buffer = Buffer.from(base64Image, "base64");

        const response = await openai.images.edit({
            image: buffer as unknown as Uploadable,
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "url",
        });

        return { url: response.data[0].url ?? "" };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "Failed to generate image",
        });
    }
});
