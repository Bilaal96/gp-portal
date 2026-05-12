<script setup lang="ts">
import { computed, type TextareaHTMLAttributes } from 'vue';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

defineOptions({ inheritAttrs: false });

const props = defineProps<
    TextareaHTMLAttributes & {
        label?: string;
    }
>();

// Required to get around known TS error caused when destructuring from large types such as InputHTMLAttributes
const textareaProps = computed<TextareaHTMLAttributes>(() => {
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

defineEmits(['input']);
</script>

<template>
    <div class="space-y-2">
        <Label v-if="props.label" :for="props.id" class="ml-1 font-bold">
            {{ props.label }}
        </Label>
        <textarea
            v-bind="{ ...textareaProps, ...$attrs }"
            @input="$emit('input', $event)"
            data-slot="textarea"
            :class="
                cn(
                    'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
                    props.class,
                )
            "
        />
    </div>
</template>
