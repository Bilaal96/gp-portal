<script setup lang="ts">
/**
 * Shad-cn's Input is not compatible with Tanstack Form out of the box.
 * It is designed for compatibility with v-model, which Tanstack Form does not adhere to.
 * Tanstack Form's pattern requires explicitly binding
    - :value
    - an @input event listener.
 * This component allows the consumer to provide the explicit bindings.
    - value is forwarded as a prop
    - this component emits the `input` event & delegates functionality to the consumer
 * This component:
    - emits the `input` event, allowing the consumer to handle the event logic
    - allows the consumer to explicitly bind value as a prop, then forward it to the <input> element.

 * NOTE: when using <input>, an alternative to type="number" is passing:
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"

    - Use min / max attributes as necessary
     
 * PROS:
    + inputmode="numeric" shows number-pad on mobile for better UX (specifically iPhone)
 * CONS: 
    - <input> with type="text" is incompatible with valueAsNumber
    - must manually parse string value to int & handle NaN results
 */

import { computed, useTemplateRef, type InputHTMLAttributes } from 'vue';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

defineOptions({ inheritAttrs: false });

const props = defineProps<
    InputHTMLAttributes & {
        label?: string;
    }
>();
defineEmits(['input']);

const inputRef = useTemplateRef('input');
defineExpose({ input: inputRef });

// Required to get around known TS error caused when destructuring from large types such as InputHTMLAttributes
const inputProps = computed<InputHTMLAttributes>(() => {
    const rest = { ...props } as any;

    // Omit props that don't apply to <input>
    // -- used by the component
    delete rest.label;
    // -- defined on InputHTMLAttributes type
    // -- give runtime warning in browser console
    delete rest.prefix;
    delete rest.property;
    delete rest.about;
    delete rest.resource;
    delete rest.typeof;
    delete rest.vocab;

    return rest;
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
            ref="input"
            v-bind="{ ...inputProps, ...$attrs }"
            @input="$emit('input', $event)"
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
