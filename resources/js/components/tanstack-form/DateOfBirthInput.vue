<script setup lang="ts">
import { cn } from '@/lib/utils';

import type { DateOfBirth } from '../patient-registration/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import type { TanstackField } from './types';

const props = defineProps<{
    idPrefix?: string;
    field: TanstackField<DateOfBirth>;
    required?: boolean;
}>();

const baseStyles = cn(
    'h-9 w-full min-w-max rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'w-24',
);

function getInputId(key: 'day' | 'month' | 'year') {
    const prefix = props.idPrefix ? props.idPrefix + '-' : '';
    return prefix + 'dob-' + key;
}

/**
 * Synchronises day & year inputs with the corresponding tanstack form state.
 * Note that `dateOfBirth` state must conform to the `DateOfBirth` type.
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
    console.log('DateOfBirthInput', {
        key,
        inputValue: subFieldValue,
        formState: props.field.state.value[key],
    });
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
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
        - e.g. have one dateOfBirth field wrapping all 3 inputs
        - pass field to each input, then update dateOfBirth.day, dateOfBirth.month, dateOfBirth.year
        * YES - use field.form.setFieldValue(fieldName, value) in @input

        ? I could set the field value to an object containing day, month, year properties
        - then when updating the state use: 
        - { ...field.state.value, day: <new day here> }
        * FALLBACK IF ABOVE DOESN'T WORK

        ? Should state store a single Date() instance or 3 separate values:
        - separate is more flexible - construct & format dates however you want.
        ? should the separate values be string or number type?

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
        <legend class="mb-1 ml-1 text-sm font-bold">Date of Birth</legend>

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
                <SelectTrigger
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
            <input
                type="number"
                data-slot="input"
                :class="cn(baseStyles)"
                :id="getInputId('day')"
                aria-label="Day"
                placeholder="Day"
                :name="`${props.field.name}.day`"
                :value="props.field.state.value.day"
                @input="handleInput('day', $event)"
                min="1"
                max="31"
                maxlength="2"
                :required
            />

            <input
                type="number"
                inputmode="numeric"
                data-slot="input"
                :class="cn(baseStyles)"
                :id="getInputId('year')"
                aria-label="Year"
                placeholder="Year"
                :name="`${props.field.name}.year`"
                :value="props.field.state.value.year"
                @input="handleInput('year', $event)"
                min="1900"
                :max="new Date().getUTCFullYear()"
                maxlength="4"
                :required
            />
        </div>
    </fieldset>

    <!-- <div class="flex flex-col gap-4 md:flex-row">
        <div class="space-y-2">
            <Label :for="getInputId('day')" class="ml-1 font-bold">Day</Label>
            <input
                type="number"
                data-slot="input"
                :class="cn(baseStyles)"
                :id="getInputId('day')"
                :name="`${props.field.name}.day`"
                :value="props.field.state.value.day"
                @input="handleInput('day', $event)"
                min="1"
                max="31"
            />
        </div>

        <div class="space-y-2">
            <Label :for="getInputId('month')" class="ml-1 font-bold">Month</Label>
            <input
                type="number"
                data-slot="input"
                :class="cn(baseStyles)"
                :id="getInputId('month')"
                :name="`${props.field.name}.month`"
                :value="props.field.state.value.month"
                @input="handleInput('month', $event)"
                min="1"
                max="12"
            />
        </div>

        <div class="space-y-2">
            <Label :for="getInputId('year')" class="ml-1 font-bold">Year</Label>
            <input
                type="number"
                data-slot="input"
                :class="cn(baseStyles)"
                :id="getInputId('year')"
                :name="`${props.field.name}.year`"
                :value="props.field.state.value.year"
                @input="handleInput('year', $event)"
                min="1900"
                :max="new Date().getUTCFullYear()"
            />
        </div> 
    </div> -->
</template>
