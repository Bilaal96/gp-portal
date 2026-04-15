<script setup lang="ts">
import { type InputHTMLAttributes } from 'vue';
import { Input } from '@/components/form-inputs';
import { type TDate } from '@/components/patient-registration/form/types';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MONTHS } from '@/lib/constants';
import { capitalize, cn } from '@/lib/utils';
import type { TanstackField } from '@/types';

const props = defineProps<{
    field: TanstackField<TDate>;
    label: string;
    idPrefix?: string;
    required?: boolean;
}>();

/**
 * Prefixes `props.idPrefix` to a given `key`.
 * Used to make value of HTML `id` attribute unique.
 */
function getInputId(key: 'day' | 'month' | 'year') {
    const prefix = props.idPrefix ? props.idPrefix + '-' : '';
    return prefix + key;
}

/**
 * Dynamically defines props shared between `day` & `year` inputs.
 * Updates to shared props of these inputs can be made in one place.
 */
function getInputProps(
    key: 'day' | 'year',
    type: 'text' | 'number' = 'number',
) {
    type DataAttributes = Record<`data-${string}`, string>;
    type InputProps = InputHTMLAttributes & DataAttributes;

    const capitalizedKey = capitalize(key);
    let inputProps: InputProps = {
        type,
        'aria-label': capitalizedKey,
        placeholder: capitalizedKey,
        id: getInputId(key),
        class: cn('w-24'),
        name: `${props.field.name}.${key}`,
        value: `${props.field.state.value[key]}`,
    };

    if (type === 'text') {
        inputProps = {
            ...inputProps,
            inputmode: 'numeric',
            pattern: '[0-9]*',
        };
    }

    return inputProps;
}

/**
 * Synchronises `day` & `year` inputs with the corresponding tanstack form state.
 */
function handleInput(key: 'day' | 'year', e: Event) {
    const subFieldName = `${props.field.name}.${key}`;
    const subFieldValue = (e.target as HTMLInputElement).valueAsNumber;

    // Set tanstack form state with fallback when input value equals NaN
    props.field.form.setFieldValue(
        subFieldName,
        Number.isNaN(subFieldValue) ? null : subFieldValue,
    );

    // [DEBUG] input value & corresponding state
    console.log('DateInput', {
        key,
        inputValue: subFieldValue,
        formState: props.field.state.value[key],
    });
}
</script>
<template>
    <!-- 
        * state is composed of values from 3 separate inputs: month, day & year
        * how should date be stored in form state?
        - 3 separate values
        - or transform into one value?
        
        ? is Tanstack Array Field required here? 
        * Unlikely that Array Field is required
        * Seems like this is for Dynamic inputs 
        - where each item in the array maps to a single distinct input
        - items may be added to/removed from the array

        month determines number of days
        - 31 -> odd numbered
        - 30 -> even numbered
         * Exception: February has 28 days (or 29 in a leap year)
        
        year determines if it's a leap year

        --------------------------------------------------

        ? Can i update nested fields 
        - e.g. have one date field wrapping all 3 inputs
        - pass field to each input, then update date.day, date.month, date.year
        * YES - use field.form.setFieldValue(fieldName, value) in @input

        ? I could set the field value to an object containing day, month, year properties
        - then when updating the state use: 
        - { ...field.state.value, day: <new day here> }
        * FALLBACK IF ABOVE DOESN'T WORK

        ? Should state store a single Date() instance or 3 separate values:
        - separate is more flexible - construct & format dates however you want.
        ? should the separate values be string or number type?
        - went with number as it can easily be converted to string

        ? If I use a Date() instance, will laravel parse it correctly?
        - yes it can, usually sent as ISO string - you may need to use the Carbon library to explicitly tell Laravel how to treat it

        ? What's easier to validate - a single Date instance or 3 separate numbers?
        - On FE I have 3 inputs, so have to validate them anyway
        - If FE sends date to BE, then I only have to validate the date
        - If FE sends 3 numbers, then I have to validate all 3 numbers + construct the date
        - If the date is invalid, how do I reflect this on FE, how does the BE know which field contains the error?

        * FE 3 inputs, validate each input separately on change
        * FE submission, construct date - is valid? 
            - not future date
            - age restrictions?
        * BE receives & validates the date - does not care about UI state (3 separate values)
            - not future date
            - age restrictions?
    -->

    <fieldset>
        <legend class="mb-1 ml-1 text-sm font-bold">{{ props.label }}</legend>

        <p class="mb-2 ml-1 text-xs text-muted-foreground">
            e.g. January 15 1987
        </p>

        <div class="flex gap-2">
            <Select
                :name="`${props.field.name}.month`"
                :default-value="
                    props.field.form.getFieldValue(
                        `${props.field.name}.month`,
                    ) ?? null
                "
                @update:modelValue="
                    (value) => {
                        props.field.form.setFieldValue(
                            `${props.field.name}.month`,
                            value,
                        );
                    }
                "
                :required
            >
                <!-- 
                    This is a button rendered in the view.
                    It's what the user interacts with.
                    It toggles state to show/hide SelectContent.
                -->
                <SelectTrigger
                    :id="getInputId('month')"
                    class="w-35 hover:cursor-pointer"
                    aria-label="Month"
                >
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select a month</SelectLabel>
                        <SelectItem
                            v-for="(month, i) in MONTHS"
                            :key="month"
                            :value="i + 1"
                        >
                            {{ month }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <!-- 
                Alternative* props to type="number":
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                * incompatible with valueAsNumber
                * must manually parse string value to int

                Use min / max attributes as necessary

                TODO: calculate max attribute for day input
                - if month not selected, use 31
                - if month selected, calculate days using selected month AND current year (accounts for leap year)
                - if month AND year selected, calculate days using selected month AND selected year (accounts for leap year)
            -->
            <Input
                v-bind="getInputProps('day')"
                @input="handleInput('day', $event)"
                min="1"
                max="31"
                maxlength="2"
                :required
            />
            <Input
                v-bind="getInputProps('year')"
                @input="handleInput('year', $event)"
                min="1900"
                :max="new Date().getUTCFullYear()"
                maxlength="4"
                :required
            />

            <!-- Without getInputProps() -->
            <!-- <Input
                type="number"
                :class="inputStyles"
                aria-label="Day"
                placeholder="Day"
                :id="getInputId('day')"
                :name="`${props.field.name}.day`"
                :value="props.field.state.value.day"
                @input="handleInput('day', $event)"
                min="1"
                max="31"
                maxlength="2"
                :required
            />

            <Input
                type="number"
                aria-label="Year"
                placeholder="Year"
                :id="getInputId('year')"
                :class="inputStyles"
                :name="`${props.field.name}.year`"
                :value="props.field.state.value.year"
                @input="handleInput('year', $event)"
                min="1900"
                :max="new Date().getUTCFullYear()"
                maxlength="4"
                :required
            /> -->
        </div>
    </fieldset>
</template>
