<script setup lang="ts">
import { watch } from 'vue';
import { DateInput } from '@/components/form-inputs';
import Input from '@/components/form-inputs/Input.vue';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDebugForm } from '@/composables/useDebugForm';
import { COUNTRIES } from '@/lib/constants';

const props = defineProps<FormStepProps>();

const countryOfBirth = props.form.useStore(
    (state) => state.values.identity.countryOfBirth,
);
watch(countryOfBirth, (state) => {
    // Reset `identity.ukFirstArrivalDate` field if applicant was born in the UK
    if (state === 'United Kingdom') {
        props.form.setFieldValue('identity.ukFirstArrivalDate', {
            day: null,
            month: null,
            year: null,
        });
    }
});

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, { formStep: 'identity', label: props.title });
</script>

<template>
    <div :id="props.id">
        <p class="mb-4">
            Before we begin, we must confirm if you are applying for yourself or
            on behalf of someone else. Please answer the following questions to
            proceed with the registration process.
        </p>

        <!-- All Questions -->
        <div class="space-y-4">
            <form.Field name="identity.nhsNumber" v-slot="{ field }">
                <Input
                    class="max-w-sm"
                    id="nhs-number"
                    label="NHS Number"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>
            <form.Field
                name="identity.nationalInsuranceNumber"
                v-slot="{ field }"
            >
                <Input
                    class="max-w-sm"
                    id="ni-number"
                    label="National Insurance Number"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>

            <form.Field name="identity.countryOfBirth" v-slot="{ field }">
                <Label for="country-of-birth" class="mb-2 ml-1 font-bold">
                    Country of Birth
                </Label>
                <Select
                    :default-value="field.state.value"
                    @update:modelValue="
                        (selectedCountry) =>
                            field.setValue(selectedCountry as string)
                    "
                    required
                >
                    <!-- 
                        This is a button rendered in the view.
                        It's what the user interacts with.
                        It toggles state to show/hide SelectContent.
                    -->
                    <SelectTrigger
                        id="country-of-birth"
                        class="w-full max-w-sm hover:cursor-pointer"
                        aria-label="Country of Birth"
                    >
                        <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select a country</SelectLabel>
                            <SelectItem
                                v-for="country in COUNTRIES"
                                :key="country"
                                :value="country"
                            >
                                {{ country }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </form.Field>

            <form.Field
                v-if="countryOfBirth !== 'United Kingdom'"
                name="identity.ukFirstArrivalDate"
                v-slot="{ field }"
            >
                <DateInput
                    id-prefix="uk-first-arrival"
                    label="On which day did you first arrive in the UK?"
                    :field
                />
            </form.Field>
        </div>
    </div>
</template>
