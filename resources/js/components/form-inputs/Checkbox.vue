<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    id: string;
    label: string;
}>();

// Vue docs: Checkboxes typically emit 'change' event
defineEmits(['change']);
</script>

<template>
    <div class="ml-1 flex gap-2 [*+&]:mt-2">
        <Checkbox
            :id
            :class="props.class"
            @update:modelValue="(value) => $emit('change', value)"
        />
        <Label :for="id">{{ label }}</Label>
    </div>
</template>
