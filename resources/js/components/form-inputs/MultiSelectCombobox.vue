<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LabelledOption {
    label: string;
    value: string;
}

type Option = string | LabelledOption;
type GroupedOptions = Record<string, Option[]>;
type OptionsProp = Option[] | GroupedOptions;

const props = defineProps<{
    label?: string; // user instruction
    prompt?: string; // shown in trigger
    placeholder?: string; // filter input placeholder
    emptyPrompt?: string; // shown when no filtered results
    options: OptionsProp;
    selectedOptions: string[];
    width?: string;
}>();
const emit = defineEmits(['update:selectedOptions']);

const open = ref(false);

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Takes `(string | LabelledOption)[]` & returns `LabelledOption[]`.
 * This structure is required by this component to render selectable items.
 */
function normaliseOptionsArray(options: Option[]): LabelledOption[] {
    return options.map((option) => {
        if (typeof option === 'string') {
            return { label: option, value: option };
        }
        return option;
    });
}

/**
 * Array of render-able options for the input.
 * Computed when `selectedOptions` is an `array`.
 */
const ungroupedOptions = computed(() => {
    if (!Array.isArray(props.options)) return null;

    return normaliseOptionsArray(props.options);
});

/**
 * Object containing render-able options for the input.
 * Option arrays are grouped under object keys.
 * Computed when `selectedOptions` is an `object`.
 */
const groupedOptions = computed(() => {
    if (!isObject(props.options)) return null;

    const normalisedOptions: Record<string, LabelledOption[]> = {};

    for (const groupName in props.options) {
        const groupValues = props.options[groupName];

        normalisedOptions[groupName] = normaliseOptionsArray(groupValues);
    }

    return normalisedOptions;
});

function closeCommandList() {
    open.value = false;
}

function handleOptionSelect(option: LabelledOption) {
    emit('update:selectedOptions', option.value);
    closeCommandList();
}

const getCommandItemStyles = (optionValue: string) => {
    return cn(
        'hover:cursor-pointer hover:bg-primary/10 data-[highlighted]:bg-primary/20 data-[highlighted]:text-accent-foreground',
        { 'bg-primary/40': props.selectedOptions.includes(optionValue) },
    );
};

const showCheckIcon = (optionValue: string) => {
    return props.selectedOptions.includes(optionValue)
        ? 'opacity-100'
        : 'opacity-0';
};
</script>

<template>
    <p v-if="label" class="mb-2 ml-1 text-sm font-bold">{{ label }}</p>

    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                :class="
                    cn(
                        'mb-2 justify-between hover:cursor-pointer hover:bg-primary/40',
                        width,
                    )
                "
            >
                <span class="text-muted-foreground">
                    {{ prompt ?? 'Select item...' }}
                </span>
                <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent :class="cn('p-0', width)" align="start">
            <Command>
                <CommandInput :placeholder="placeholder ?? 'Search'">
                    <!-- Slot reserved for action button -->
                    <template #action="slotProps">
                        <slot
                            name="action"
                            v-bind="slotProps"
                            :close-combobox="closeCommandList"
                        />
                    </template>
                </CommandInput>

                <CommandList>
                    <CommandEmpty>{{
                        emptyPrompt ?? 'No matches found.'
                    }}</CommandEmpty>

                    <!-- Render simple `LabelledOptions[]` -->
                    <template v-if="ungroupedOptions">
                        <CommandGroup class="space-y-0.5">
                            <CommandItem
                                v-for="option in ungroupedOptions"
                                :key="option.value"
                                :value="option.value"
                                @select="handleOptionSelect(option)"
                                :class="getCommandItemStyles(option.value)"
                            >
                                <CheckIcon
                                    :class="
                                        cn(
                                            'mr-2 h-4 w-4',
                                            showCheckIcon(option.value),
                                        )
                                    "
                                />
                                {{ option.label }}
                            </CommandItem>
                        </CommandGroup>
                    </template>

                    <!-- Render grouped `LabelledOptions[]` -->
                    <template v-if="groupedOptions">
                        <template
                            v-for="(options, groupName) in groupedOptions"
                            :key="groupName"
                        >
                            <CommandGroup
                                class="space-y-0.5"
                                :heading="groupName"
                            >
                                <CommandItem
                                    v-for="option in options"
                                    :key="option.value"
                                    :value="option.value"
                                    @select="handleOptionSelect(option)"
                                    :class="getCommandItemStyles(option.value)"
                                >
                                    <CheckIcon
                                        :class="
                                            cn(
                                                'mr-2 h-4 w-4',
                                                showCheckIcon(option.value),
                                            )
                                        "
                                    />
                                    {{ option.label }}
                                </CommandItem>
                            </CommandGroup>
                        </template>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
