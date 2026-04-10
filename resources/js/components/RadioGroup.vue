<script setup lang="ts">
import type { RadioGroupOption } from '@/components/tanstack-form/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const props = withDefaults(
    defineProps<{
        prompt: string;
        options: RadioGroupOption[];
        id?: string;
        defaultValue?: string;
    }>(),
    { defaultValue: '' },
);

// Vue docs: Radio buttons typically emit 'change' event
defineEmits(['change']);
</script>

<template>
    <div :id class="ml-1">
        <!-- Question -->
        <p class="mb-3 text-sm font-bold">{{ prompt }}</p>

        <!-- Possible answers -->
        <div class="ml-2">
            <RadioGroup
                :default-value
                @update:model-value="(value) => $emit('change', value)"
            >
                <div
                    v-for="{ id, label, value } in props.options"
                    class="flex items-center gap-2"
                    :key="id"
                >
                    <RadioGroupItem :id :value />
                    <Label :for="id">{{ label }}</Label>
                </div>
            </RadioGroup>
        </div>
    </div>
</template>
