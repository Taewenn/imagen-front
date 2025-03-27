export interface GenerateImageParams {
    image: File;
    prompt: string;
}

export const generateImage = async ({
    image,
    prompt,
}: GenerateImageParams): Promise<string> => {
    try {
        // Convert the image to base64
        const base64Image = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = (e.target?.result as string)?.split(",")[1];
                resolve(base64);
            };
            reader.readAsDataURL(image);
        });

        const response = await fetch("/api/generate-image", {
            method: "POST",
            body: JSON.stringify({
                base64Image,
                prompt,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please try again.");
    }
};
