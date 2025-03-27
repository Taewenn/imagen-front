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

        if (!base64Image) {
            throw new Error("No image provided");
        }

        // Convert base64 to Buffer
        const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );

        // Validate image size
        if (buffer.length > 4 * 1024 * 1024) {
            // 4MB limit
            throw new Error("Image size exceeds 4MB limit");
        }

        const response = await openai.images.edit({
            image: buffer as unknown as Uploadable,
            prompt: prompt || "",
            n: 1,
            size: "512x512",
            response_format: "url",
        });

        if (!response.data?.[0]?.url) {
            throw new Error("No image URL returned from OpenAI");
        }

        return { url: response.data[0].url };
    } catch (error) {
        console.error("Error in generate-image:", error);
        throw createError({
            statusCode: 500,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to generate image",
            cause: error,
        });
    }
});
