<script setup lang="ts">
import { watch } from 'vue';
import DateOfBirthInput from '@/components/tanstack-form/DateOfBirthInput.vue';
import Input from '@/components/tanstack-form/Input.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { type PatientRegistrationForm } from '../form';

const props = defineProps<{ form: PatientRegistrationForm }>();

// Reactive state logging for debugging tanstack form input syncing
const personal = props.form.useStore((state) => state.values.personal);
watch(personal, (state) =>
    console.log('Personal Details', JSON.parse(JSON.stringify(state))),
);
</script>

<template>
    <div>
        <h1 class="mb-2 text-2xl font-bold">Personal Details</h1>

        <p class="mb-4">
            Before we begin, we must confirm if you are applying for yourself or
            on behalf of someone else. Please answer the following questions to
            proceed with the registration process.
        </p>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- Name Fields -->
            <div class="flex flex-col gap-4 md:flex-row">
                <form.Field name="personal.firstName">
                    <template v-slot="{ field }">
                        <Input
                            class="max-w-sm"
                            label="First Name"
                            id="first-name"
                            :field
                        />
                    </template>
                </form.Field>

                <form.Field name="personal.middleNames">
                    <template v-slot="{ field }">
                        <Input
                            class="max-w-sm"
                            label="Middle Name(s)"
                            id="middle-names"
                            :field
                        />
                    </template>
                </form.Field>

                <form.Field name="personal.lastName">
                    <template v-slot="{ field }">
                        <Input
                            class="max-w-sm"
                            label="Last Name"
                            id="last-name"
                            :field
                        />
                    </template>
                </form.Field>
            </div>

            <!-- Previous Name(s) -->
            <form.Field name="personal.previousNames">
                <template v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        label="Previous Name(s)"
                        id="previous-names"
                        :field
                    />
                </template>
            </form.Field>

            <Separator class="my-2" />

            <!-- Date of Birth - restrict to any past date -->
            <form.Field name="personal.dateOfBirth">
                <template v-slot="{ field }">
                    <DateOfBirthInput id-prefix="applicant" :field />
                </template>
            </form.Field>

            <!-- Sex Registered at Birth -->
            <!-- Gender Identity -->
            <!-- Are you pregnant (conditionally rendered
                - dependent on sex at birth) 
            -->
            <!-- Have you lived in the UK for more than 3 Months? -->
            <!-- Approval of your registration application may take up to 14 days. Please check the box to confirm that you understand. -->
        </div>

        <!-- End: All Questions -->
    </div>
</template>
