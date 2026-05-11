<script setup lang="ts">
/**
 * TODO Save step data (to DB session)
 * TODO Persist/restore step data (if exists) on navigation
 * TODO Form Validation
 */

// TODO: Wrap in helper?
// Precognition useForm
// Tanstack useForm

import { computed, watchEffect } from 'vue';
import { usePatientRegistrationForm } from '@/components/patient-registration/form/utils';
import formSteps from '@/components/patient-registration/form-steps';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/composables/useStepper';

const stepper = useStepper();
const currentStep = computed(() => formSteps[stepper.stepIndex.value]);

const form = usePatientRegistrationForm();

watchEffect(() => {
    console.log({
        stepIndex: stepper.stepIndex.value,
        step: currentStep.value.props.id,
    });
});
</script>

<template>
    <div class="patient-registration">
        <p class="lg:text-red-600">
            Step: {{ stepper.stepIndex.value + 1 }} / {{ formSteps.length }}
        </p>

        <form @submit="form.handleSubmit()">
            <!-- 
                - Can pass additional props - they will merge 
                - Order matters - later props will override earlier ones with same name
            -->
            <keep-alive>
                <component
                    :is="currentStep.component"
                    v-bind="currentStep.props"
                    :form="form"
                />
            </keep-alive>

            <div class="mt-6 flex">
                <Button
                    v-if="stepper.stepIndex.value - 1 !== -1"
                    type="button"
                    class="cursor-pointer bg-foreground hover:bg-foreground/90"
                    @click="stepper.prev()"
                    >Back</Button
                >
                <Button
                    v-if="stepper.stepIndex.value + 1 !== formSteps.length"
                    type="button"
                    class="ml-auto cursor-pointer"
                    @click="stepper.next()"
                    >Next</Button
                >
            </div>
        </form>
    </div>
</template>
