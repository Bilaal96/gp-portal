<script setup lang="ts">
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
        subtext?: string;
    }>(),
    { defaultValue: '' },
);

// Vue docs: Radio buttons typically emit 'change' event
defineEmits(['change']);
</script>

<template>
    <div :id class="ml-1">
        <!-- Question -->
        <p
            :class="
                cn('mb-2 text-sm font-bold', {
                    'mb-3': !subtext || subtext.length === 0,
                })
            "
        >
            {{ prompt }}
        </p>
        <p v-if="subtext?.length" class="mb-3 text-xs text-muted-foreground">
            {{ subtext }}
        </p>

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
