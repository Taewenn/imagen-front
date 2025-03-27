import { generateImage as generateImageWithAI } from "@/services/openai";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Style {
    id: string;
    name: string;
    prompt: string;
    preview: string;
}

export const useImageEditorStore = defineStore("imageEditor", () => {
    // State
    const originalImage = ref<File | null>(null);
    const originalImagePreview = ref<string | null>(null);
    const selectedStyle = ref<Style | null>(null);
    const generatedImageUrl = ref<string | null>(null);
    const isGenerating = ref(false);
    const error = ref<string | null>(null);

    // Methods
    const setOriginalImage = async (file: File) => {
        originalImage.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const setSelectedStyle = (style: Style | null) => {
        selectedStyle.value = style;
    };

    const generateImage = async () => {
        if (!originalImage.value || !selectedStyle.value) return;

        try {
            isGenerating.value = true;
            error.value = null;

            const result = await generateImageWithAI({
                image: originalImage.value,
                prompt: selectedStyle.value.prompt,
            });

            generatedImageUrl.value = result;
        } catch (e) {
            error.value = e instanceof Error ? e.message : "An error occurred";
        } finally {
            isGenerating.value = false;
        }
    };

    const reset = () => {
        originalImage.value = null;
        originalImagePreview.value = null;
        selectedStyle.value = null;
        generatedImageUrl.value = null;
        isGenerating.value = false;
        error.value = null;
    };

    return {
        // State
        originalImage,
        originalImagePreview,
        selectedStyle,
        generatedImageUrl,
        isGenerating,
        error,
        // Methods
        setOriginalImage,
        setSelectedStyle,
        generateImage,
        reset,
    };
});
