<script setup lang="ts">
import ImageUploader, {
    type UploadedFile,
} from "@/components/ImageEditor/ImageUploader.vue";
import StyleGrid from "@/components/ImageEditor/StyleGrid.vue";
import { Button } from "@/components/ui/button";
import { generateImage } from "@/services/openai";
import { ref } from "vue";

// Types
interface Style {
    id: string;
    name: string;
    prompt: string;
    preview: string;
}

// State
const originalImage = ref<UploadedFile | null>(null);
const selectedStyle = ref<Style | null>(null);
const generatedImageUrl = ref<string | null>(null);
const isGenerating = ref(false);
const error = ref<string | null>(null);

// Methods
const handleStyleSelect = (style: Style) => {
    selectedStyle.value = style;
};

const handleGenerate = async () => {
    if (!originalImage.value || !selectedStyle.value) return;

    try {
        isGenerating.value = true;
        error.value = null;

        const result = await generateImage({
            image: originalImage.value.file,
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
    selectedStyle.value = null;
    generatedImageUrl.value = null;
    isGenerating.value = false;
    error.value = null;
};
</script>

<template>
    <main class="min-h-screen bg-background">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-center mb-8">
                Transform Your Images
            </h1>

            <!-- Step 1: Upload -->
            <section class="mb-8">
                <ImageUploader v-model="originalImage" />
            </section>

            <!-- Step 2: Select Style -->
            <section class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold">Choose a Style</h2>
                    <Button variant="ghost" @click="reset">
                        Change Image
                    </Button>
                </div>
                <StyleGrid
                    :selected-style="selectedStyle"
                    @select="handleStyleSelect"
                />
            </section>

            <!-- Step 3: Generate -->
            <section class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold">Preview</h2>
                    <div class="space-x-2">
                        <Button variant="ghost" @click="selectedStyle = null">
                            Change Style
                        </Button>
                        <Button variant="ghost" @click="reset">
                            Change Image
                        </Button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Original Image -->
                    <div class="space-y-2">
                        <h3 class="font-medium">Original</h3>
                        <div
                            class="aspect-square w-full overflow-hidden rounded-lg"
                        >
                            <img
                                v-if="originalImage"
                                :src="originalImage.preview"
                                alt="Original"
                                class="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <!-- Generated Image -->
                    <div class="space-y-2">
                        <h3 class="font-medium">
                            {{ selectedStyle?.name }}
                        </h3>
                        <div
                            class="aspect-square w-full overflow-hidden rounded-lg bg-muted relative"
                        >
                            <template v-if="isGenerating">
                                <div
                                    class="absolute inset-0 flex items-center justify-center"
                                >
                                    <div
                                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                                    ></div>
                                </div>
                            </template>
                            <template v-else-if="generatedImageUrl">
                                <img
                                    :src="generatedImageUrl"
                                    :alt="selectedStyle?.name"
                                    class="h-full w-full object-cover"
                                />
                            </template>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-center">
                    <Button
                        size="lg"
                        :disabled="isGenerating"
                        @click="handleGenerate"
                    >
                        {{ isGenerating ? "Generating..." : "Generate" }}
                    </Button>
                </div>

                <p v-if="error" class="mt-4 text-destructive text-center">
                    {{ error }}
                </p>
            </section>
        </div>
    </main>
</template>
