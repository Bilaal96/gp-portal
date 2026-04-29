<script setup lang="ts">
import { useSlots } from 'vue';
import { type RadioGroupOptionLiteral } from '@/components/form-inputs/radio-group/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        prompt: string;
        options: RadioGroupOptionLiteral[];
        id?: string;
        defaultValue?: string;
    }>(),
    { defaultValue: '' },
);

// Vue docs: Radio buttons typically emit 'change' event
defineEmits(['change']);

const slots = useSlots();
</script>

<template>
    <div :id class="ml-1">
        <!-- Question -->
        <p
            :class="
                cn('mb-2 text-sm font-bold', {
                    'mb-3': !slots.subtext,
                })
            "
        >
            {{ prompt }}
        </p>
        <div v-if="slots.subtext" class="mb-3 text-xs">
            <slot name="subtext" />
        </div>

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
