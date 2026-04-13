<script setup lang="ts">
/**
 * TODO Save step data (to DB session)
 * TODO Persist/restore step data (if exists) on navigation
 * TODO Form Validation
 * TODO Flesh out form navigation between steps
 */

// TODO: Wrap in helper?
// Precognition useForm
// Tanstack useForm

import { useLocalStorage } from '@vueuse/core';
import { computed, watchEffect } from 'vue';
import { createPatientRegistrationForm } from '@/components/patient-registration/form';
import formSteps from '@/components/patient-registration/form-steps';
import { Button } from '@/components/ui/button';

// REVIEW: [DEV] local storage used so I don't have to keep navigating form steps
// Rest of the form details are NOT stored in local storage
const stepIndex = useLocalStorage('registration-form-step', 0);
const step = computed(() => formSteps[stepIndex.value]);

watchEffect(() => console.log({ stepIndex, step: step.value.id }));

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
