<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

// Types
interface Style {
    id: string;
    name: string;
    prompt: string;
    preview: string;
}

// Props
defineProps<{
    selectedStyle: Style | null;
}>();

const emit = defineEmits<{
    (e: "select", style: Style): void;
}>();

// State
const styles: Style[] = [
    {
        id: "ghibli",
        name: "Studio Ghibli",
        prompt: "Transform this image in the iconic Studio Ghibli animation style, with soft colors, detailed backgrounds, and whimsical elements",
        preview: "/styles/ghibli.jpg",
    },
    {
        id: "lego",
        name: "LEGO",
        prompt: "Convert this image into a LEGO-style illustration, with characteristic brick textures and plastic-like sheen",
        preview: "/styles/lego.jpg",
    },
    {
        id: "simpsons",
        name: "Simpsons",
        prompt: "Recreate this image in The Simpsons cartoon style, with yellow skin tones, bold outlines, and simplified features",
        preview: "/styles/simpsons.jpg",
    },
];
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
        <Card
            v-for="style in styles"
            :key="style.id"
            class="cursor-pointer transition-all hover:scale-105"
            :class="{ 'ring-2 ring-primary': selectedStyle?.id === style.id }"
            @click="emit('select', style)"
        >
            <CardContent class="p-0">
                <!-- <div class="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                        v-if="style.preview"
                        :src="style.preview"
                        :alt="style.name"
                        class="h-full w-full object-cover"
                    />
                </div> -->
                <div class="p-4">
                    <h3 class="font-semibold">{{ style.name }}</h3>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
