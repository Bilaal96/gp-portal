<script setup lang="ts">
import { DateInput } from '@/components/form-inputs';
import Input from '@/components/form-inputs/Input.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';

const props = defineProps<FormStepProps>();

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, {
    formStep: 'previousMedicalRecords',
    label: props.title,
});
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
            <!-- Name of previous GP (person) -->
            <form.Field
                name="previousMedicalRecords.previousGP.name"
                v-slot="{ field }"
            >
                <Input
                    class="max-w-sm"
                    id="previous-gp-name"
                    label="What is the name of your previous GP (location)?"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>

            <!-- Address of previous GP (location) -->
            <div id="address-fields" class="space-y-2">
                <p class="mb-2 ml-1 text-sm font-bold">
                    What is the address of your previous GP?
                </p>

                <!-- First line -->
                <form.Field
                    name="previousMedicalRecords.previousGP.address1"
                    v-slot="{ field }"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 1"
                        id="prev-gp-address-line-1"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Second line (optional) -->
                <form.Field
                    name="previousMedicalRecords.previousGP.address2"
                    v-slot="{ field }"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 2"
                        id="prev-gp-address-line-2"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>

                <!-- City -->
                <form.Field
                    name="previousMedicalRecords.previousGP.city"
                    v-slot="{ field }"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="City"
                        id="prev-gp-address-city"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Post Code -->
                <form.Field
                    name="previousMedicalRecords.previousGP.postCode"
                    v-slot="{ field }"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Post Code"
                        id="prev-gp-address-post-code"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>
            </div>

            <!-- DateInput - Approx. date you left previous GP -->
            <form.Field
                name="previousMedicalRecords.previousGP.departureDate"
                v-slot="{ field }"
            >
                <DateInput
                    id-prefix="prev-gp-departure-date"
                    label="Please provide the approximate date of departure from your previous GP:"
                    :field
                />
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Would you like us to request your medical records? -->
            <form.Field
                name="previousMedicalRecords.shouldRequestMedicalRecords"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="request-medical-records-radio-group"
                    prompt="Would you like us to request your medical records?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Have you served in the Armed Forces? -->
            <form.Field
                name="previousMedicalRecords.hasServedInArmedForces"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="served-in-armed-forces-radio-group"
                    prompt="Have you served in the Armed Forces?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <!-- RadioGroup (binary) - Are you a veteran? -->
            <form.Field
                name="previousMedicalRecords.isVeteran"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="is-veteran-radio-group"
                    prompt="Are you a veteran?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>
        </div>
    </div>
</template>
