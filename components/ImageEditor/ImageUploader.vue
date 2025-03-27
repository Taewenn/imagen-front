<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useFileDialog } from "@vueuse/core";
import { computed, ref } from "vue";

// Types
export interface UploadedFile {
    file: File;
    preview: string;
}

// Props
const props = defineProps<{
    modelValue: UploadedFile | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: UploadedFile | null];
}>();

// State
const { toast } = useToast();
const isDragging = ref(false);

// Methods
const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;

    const files = e.dataTransfer?.files;
    if (files?.[0]) {
        await handleFile(files[0]);
    }
};

const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
        toast({
            title: "Error",
            description: "Please upload an image file",
            variant: "destructive",
        });
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
            title: "Error",
            description: "Image must be less than 5MB",
            variant: "destructive",
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        emit("update:modelValue", {
            file,
            preview: e.target?.result as string,
        });
    };
    reader.readAsDataURL(file);
};

const { open, onChange } = useFileDialog({
    accept: "image/*",
    multiple: false,
});

onChange((files) => {
    if (files?.[0]) {
        handleFile(files[0]);
    }
});

// Computed
const dragEvents = computed(() => ({
    dragenter: (e: DragEvent) => {
        e.preventDefault();
        isDragging.value = true;
    },
    dragover: (e: DragEvent) => {
        e.preventDefault();
        isDragging.value = true;
    },
    dragleave: (e: DragEvent) => {
        e.preventDefault();
        isDragging.value = false;
    },
    drop: handleDrop,
}));
</script>

<template>
    <div class="w-full max-w-md mx-auto p-4">
        <div
            v-if="!modelValue"
            class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all"
            :class="{ 'border-primary bg-primary/5': isDragging }"
            v-bind="dragEvents"
        >
            <div class="space-y-4">
                <div class="flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <div class="text-sm text-gray-600">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                </div>
                <p class="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                <Button variant="outline" @click="open"> Select Image </Button>
            </div>
        </div>

        <div v-else class="space-y-4">
            <div
                class="relative aspect-square w-full overflow-hidden rounded-lg"
            >
                <img
                    :src="modelValue.preview"
                    alt="Preview"
                    class="h-full w-full object-cover"
                />
                <Button
                    variant="destructive"
                    size="icon"
                    class="absolute top-2 right-2"
                    @click="emit('update:modelValue', null)"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    </div>
</template>
