export interface GenerateImageParams {
    image: File;
    prompt: string;
}

// Fonction pour redimensionner l'image
const resizeImage = async (
    file: File,
    maxSize: number = 1024
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Calculer les nouvelles dimensions en conservant le ratio
            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};

export const generateImage = async ({
    image,
    prompt,
}: GenerateImageParams): Promise<string> => {
    try {
        // Validate image type
        if (!image.type.startsWith("image/")) {
            throw new Error("Invalid file type. Please upload an image.");
        }

        // Redimensionner l'image avant la conversion en base64
        const resizedImage = await resizeImage(image);
        const base64Image = resizedImage;

        const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                base64Image,
                prompt: prompt.trim(),
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to generate image");
        }

        const data = await response.json();
        if (!data.url) {
            throw new Error("No image URL returned");
        }

        return data.url;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to generate image. Please try again.");
    }
};
