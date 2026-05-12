<script setup lang="ts">
import Label from '@/components/ui/label/Label.vue';
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue';
import RadioGroupItem from '@/components/ui/radio-group/RadioGroupItem.vue';

defineProps<{ form: any }>();
</script>

<!--  
    Todo: Wrap each input in Tanstack Form's: form.Field
    Todo: connect to FormWizard state

    Todo: Registration validity filter: regular or proxy registration?
    * If applying for someone else AND is existing patient
        - proceed with proxy-registration
    * If applying for someone else BUT is not an existing patient
        - invalid applicant - must be an existing patient to apply on behalf of someone else
    * If applying for self
        - proceed with regular registration process

    Todo: (Non-MVP) Catchment area - ensure applicant lives within acceptable boundary relative to clinic
        - will likely require 3rd party API for defining catchment area
-->
<template>
    <div>
        <h1 class="mb-2 text-2xl font-bold">
            Prerequisites: Self or Proxy Registration?
        </h1>

        <p class="mb-2">
            Before we begin, we must confirm if you are applying for yourself or
            on behalf of someone else. Please answer the following questions to
            proceed with the registration process.
        </p>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- Question -->
            <div>
                <!-- TODO: Proxy-registration
                    - none priority, implement later 
                    - requires patient that is already registered with the clinic
                -->
                <p class="mb-2 font-bold">Who are you registering for?</p>
                <!-- Answer -->
                <div class="ml-2">
                    <RadioGroup default-value="">
                        <div class="flex items-center gap-2">
                            <RadioGroupItem id="myself" value="myself" />
                            <Label for="myself">Myself</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioGroupItem id="my-child" value="" />
                            <Label for="my-child">My child</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioGroupItem
                                id="care-receiver"
                                value="care receiver"
                            />
                            <Label for="care-receiver"
                                >Someone I care for</Label
                            >
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <!-- Question -->
            <div>
                <!-- Todo: Proxy-registration (see "Who are you registering for?" question)
                    - dependent on answer to previous questions, so it renders conditionally 
                    - if user said they're registering for someone other than themself 
                -->
                <p class="mb-2 font-bold">
                    Are you already a patient registered with this practice?
                </p>
                <!-- Answer -->
                <div class="ml-2">
                    <RadioGroup default-value="yes">
                        <div class="flex items-center gap-2">
                            <RadioGroupItem
                                id="is-existing-patient"
                                value="yes"
                            />
                            <Label for="is-existing-patient">Yes</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioGroupItem
                                id="is-not-existing-patient"
                                value="no"
                            />
                            <Label for="is-not-existing-patient">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </div>
        <!-- End: All Questions -->
    </div>
</template>
