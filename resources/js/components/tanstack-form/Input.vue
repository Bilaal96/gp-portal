<script setup lang="ts">
/**
 * Shad-cn's Input is not compatible with Tanstack Form out of the box.
 * It is designed for compatibility with v-model, which Tanstack Form does not adhere to.
 * Tanstack Form's pattern requires explicitly binding
    - :value
    - an @input event listener.
 * This components takes Shad-cn's design and conforms to Tanstack Form's pattern by:
    - receiving a field prop
    - using field.name prop to link the input element to the tanstack form instance 
    - using field.handleChange() to sync the input element with tanstack form state
 */

import { watchEffect, type HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';
import Label from '../ui/label/Label.vue';
import type { FieldProps } from './types';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    label?: string;
    id: string;
    field: FieldProps;
}>();
defineEmits(['input']);

// For debugging: logs input value
watchEffect(() => {
    console.log({ [props.field.name]: props.field.state.value });
});
</script>

<template>
    <div class="space-y-2">
        <Label
            v-if="props.label !== undefined"
            :for="props.id"
            class="ml-1 font-bold"
            >{{ props.label }}</Label
        >

        <input
            :id
            :name="props.field.name"
            :value="props.field.state.value"
            @input="
                (e: Event) => {
                    props.field.handleChange(
                        (e.target as HTMLInputElement).value,
                    );

                    // Execute side effects on input change
                    $emit('input', e);
                }
            "
            data-slot="input"
            :class="
                cn(
                    'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                    props.class,
                )
            "
        />
    </div>
</template>
