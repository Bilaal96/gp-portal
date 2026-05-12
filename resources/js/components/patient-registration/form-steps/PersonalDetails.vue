<script setup lang="ts">
import { watch } from 'vue';
import {
    Checkbox,
    DateInput,
    Input,
    RadioGroup,
} from '@/components/form-inputs';
import {
    binaryRadioGroup,
    createRadioGroupOptions,
} from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Label } from '@/components/ui/label';
import Separator from '@/components/ui/separator/Separator.vue';
import { useDebugForm } from '@/composables/useDebugForm';

const props = defineProps<FormStepProps>();

// Conditionally rendered fields
const genderIdentity = props.form.useStore(
    (state) => state.values.personal.genderIdentity,
);
const sexAtBirth = props.form.useStore(
    (state) => state.values.personal.sexAtBirth,
);

// Reset conditionally rendered field when corresponding input is unmounted
// REVIEW: For UX reasons, it may be better to clear this on submit.
// TODO: determine if resetting between input changes will annoy the user or not & if implementing reset on submit is worth it
watch(genderIdentity, (state) => {
    if (state !== 'other') {
        props.form.setFieldValue('personal.genderIdentityOther', '');
    }
});
watch(sexAtBirth, (state) => {
    if (state !== 'female') {
        props.form.setFieldValue('personal.isPregnant', undefined);
    }
});

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, { formStep: 'personal', label: props.title });
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
            <!-- Name Fields -->
            <div class="flex flex-col gap-4 md:flex-row">
                <form.Field name="personal.firstName" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        label="First Name"
                        id="first-name"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>

                <form.Field name="personal.middleNames" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        label="Middle Name(s)"
                        id="middle-names"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>

                <form.Field name="personal.lastName" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        label="Last Name"
                        id="last-name"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>
            </div>

            <form.Field name="personal.previousNames" v-slot="{ field }">
                <Input
                    class="max-w-sm"
                    label="Previous Name(s)"
                    id="previous-names"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>

            <Separator class="my-2" />

            <!-- Date of Birth - restrict to any past date -->
            <form.Field name="personal.dateOfBirth" v-slot="{ field }">
                <DateInput
                    id-prefix="applicant-dob"
                    :field
                    label="Date of Birth"
                />
            </form.Field>

            <Separator class="my-2" />

            <!-- Gender Identity -->
            <form.Field name="personal.genderIdentity" v-slot="{ field }">
                <RadioGroup
                    id="gender-identity-radio-group"
                    prompt="What is your gender identity"
                    :options="
                        createRadioGroupOptions([
                            'man',
                            'woman',
                            'non-binary',
                            'other',
                            {
                                id: 'undisclosed',
                                label: 'Prefer not to say',
                                value: 'undisclosed',
                            },
                        ])
                    "
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>

            <!-- Specify gender identity - i.e. user option is not listed -->
            <form.Field
                v-if="genderIdentity === 'other'"
                name="personal.genderIdentityOther"
                v-slot="{ field }"
            >
                <div class="ml-2 flex gap-2">
                    <Label
                        class="text-muted-foreground"
                        for="gender-identity-specify-other"
                    >
                        Please specify:
                    </Label>
                    <Input
                        class="max-w-sm"
                        id="gender-identity-other"
                        v-bind="getTextFieldProps(field)"
                    />
                </div>
            </form.Field>

            <!-- Sex Registered at Birth -->
            <form.Field name="personal.sexAtBirth" v-slot="{ field }">
                <RadioGroup
                    id="sex-at-birth"
                    prompt="Sex registered at birth:"
                    :options="
                        createRadioGroupOptions([
                            'male',
                            'female',
                            {
                                id: 'undisclosed',
                                label: 'Prefer not to say',
                                value: 'undisclosed',
                            },
                        ])
                    "
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>

            <!-- Are you pregnant (conditionally rendered
                - dependent on sex at birth) 
            -->
            <form.Field
                v-if="sexAtBirth === 'female'"
                name="personal.isPregnant"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="is-pregnant"
                    prompt="Are you pregnant?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <Separator class="my-2" />

            <!-- Have you lived in the UK for more than 3 Months? -->
            <form.Field
                name="personal.meetsUkResidencyDuration"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="uk-residency-confirmation"
                    prompt="Have you lived in the UK for more than 3 Months?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <!-- Approval of your registration application may take up to 14 days. Please check the box to confirm that you understand. -->

            <form.Field
                name="personal.acknowledgedApplicationProcessDuration"
                v-slot="{ field }"
            >
                <!-- REVIEW: 
                    - could extract to CheckboxGroup 
                    - include prompt & option to render multiple checkboxes (akin to form-inputs/RadioGroup.vue) 
                -->
                <p class="mb-2 ml-1 text-sm font-bold">
                    Please check the box below to confirm that you understand.
                </p>
                <Checkbox
                    class="ml-2"
                    id="application-duration-acknowledgement"
                    label="Approval of your application to register may take up to 14 days."
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>
        </div>

        <!-- End: All Questions -->
    </div>
</template>
