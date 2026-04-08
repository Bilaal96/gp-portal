<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { Button } from '../ui/button';

/**
 * ✅ refactor folder structure:
 *  - Organise files appropriately
 *  - don't name steps - StepOne, StepTwo etc.
    - instead provide descriptive name
    - order will be determined by position in `steps` array
  
 * ✅ Track form state - Tanstack's useForm & step ref
 
 * Determine which step should be rendered
    - Step.vue component - simpler alternative - wraps each form step
        - children (labels & inputs) can be passed and styled in-template
    - steps/index.ts - array of objects
        - each item represents a Step in the form via a Step component
        - use the steps[step ref - 1] to access & render the current step 
        - can I "use"/reference a component outside of a SFC? 
            -> yes, in an array/object inside a .ts file 
                - render using the built-in dynamic <component /> element
            -> yes with render functions 
                - using h() (short for hyperscript) - creates virtual DOM nodes
                - https://vuejs.org/guide/extras/render-function
        - what is defineComponent and when is it needed?
            -> TS-specific
            -> https://vuejs.org/guide/typescript/overview
        - complex to style?
    
 * Save step data (to DB session)
 * Restore step data (if exists) on navigation
 * Navigate between steps
 */

import formSteps from './form-steps';
import { createPatientRegistrationForm } from './form';

const stepIndex = ref(0);
const step = computed(() => formSteps[stepIndex.value]);

watchEffect(() => console.log({ stepIndex, step: step.value.id }));

// TODO: Wrap in helper?
// Precognition useForm
// Tanstack useForm

/**
 * How to handle default values for non-string inputs?
 * What if I don't want to set a default value?
 * defaultState vs defaultValues
 *
 * How to pass props to <component /> - v-bind or like regular attributes?
 */

// TODO: pass custom types for each step to useForm<>
// ! NOT POSSIBLE TO PASS CUSTOM TYPES PER FORM INSTANCE
// ? If a value is marked as dependency: the preceding input value determines if it renders or not.

/* const form = useForm({
    defaultValues: {
        proxyRegistrationGuard: {
            // TODO: proxy-registration
            // radio: yourself | (2) child | (3) someone you care for
            // ! Affects conditional rendering of subsequent form inputs
            applyingFor: '',
            // ? dependency
            // -- Answer 2 or 3: Are you already a patient registered with this practice?
            // false: not eligible - must be existing patient to apply on behalf of someone else
            // true: request user login before proceeding to proxy-registration form (should have additional step to verify identity)
            existingPatient: false,
        },
        personal: {
            firstName: '',
            middleName: '', // optional
            lastName: '',
            previousNames: '', // optional

            // date: with calendar selection
            dateOfBirth: '',

            // radio: male | female
            sexAtBirth: 'male',
            // ? dependency
            // radio: // yes | no | unsure
            isPregnant: '',

            // radio: (include "prefer not to say" option)
            genderIdentity: '',

            // Optional, radio: yes / no | true / false
            ukResidencyConfirmation: false,
            // checkbox
            acknowledgedApplicationProcessDuration: false,
        },
    },
}); */

const form = createPatientRegistrationForm();

function prevStep() {
    stepIndex.value = stepIndex.value - 1;
}

function nextStep() {
    stepIndex.value = stepIndex.value + 1;
}
</script>

<template>
    <div class="patient-registration">
        <p class="lg:text-red-600">
            Step: {{ stepIndex + 1 }} / {{ formSteps.length }}
        </p>

        <form @submit="form.handleSubmit()">
            <!-- 
            - Can pass additional props - they will merge 
            - Order matters - later props will override earlier ones with same name
        -->
            <component :is="step.component" v-bind="step.props" :form="form" />

            <div class="mt-6 flex">
                <Button
                    v-if="stepIndex - 1 !== -1"
                    class="cursor-pointer bg-foreground hover:bg-foreground/90"
                    @click="prevStep()"
                    >Back</Button
                >
                <Button
                    v-if="stepIndex + 1 !== formSteps.length"
                    class="ml-auto cursor-pointer"
                    @click="
                        () => {
                            nextStep();
                            console.log({ form: form.state.values });
                        }
                    "
                    >Next</Button
                >
            </div>
        </form>
    </div>
</template>
