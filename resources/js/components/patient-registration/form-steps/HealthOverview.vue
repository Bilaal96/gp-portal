<script setup lang="ts">
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-vue-next';
import BadgeList from '@/components/BadgeList.vue';
import {
    Input,
    MultiSelectCombobox,
    RadioGroup,
} from '@/components/form-inputs';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';
import { LONG_TERM_HEALTH_CONDITIONS } from '@/lib/constants';
const props = defineProps<FormStepProps>();

const hasLongTermCondition = props.form.useStore(
    (state) => state.values.healthOverview.hasLongTermCondition,
);

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, {
    formStep: 'healthOverview',
    label: props.title,
});
</script>

<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- Do you have any long-term medical conditions? -->
            <form.Field
                name="healthOverview.hasLongTermCondition"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="has-long-term-condition"
                    prompt="Do you have any long-term medical conditions?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <!-- Specify long-term medical conditions -->
            <form.Field
                v-if="hasLongTermCondition"
                name="healthOverview.longTermConditions"
                v-slot="{ field }"
            >
                <MultiSelectCombobox
                    label="Please inform us of any long-term medical conditions that you have:"
                    prompt="Specify long-term medical conditions..."
                    empty-prompt="No matching conditions found."
                    placeholder="Search or specify"
                    :options="LONG_TERM_HEALTH_CONDITIONS"
                    :selected-options="field.state.value"
                    @update:selected-options="
                        (selectedValue) => {
                            const valueIndex =
                                field.state.value.indexOf(selectedValue);

                            if (valueIndex === -1) {
                                field.pushValue(selectedValue);
                            } else {
                                field.removeValue(valueIndex);
                            }
                        }
                    "
                >
                    <!-- Allows user to add unlisted conditions -->
                    <template #action="{ input, closeCombobox }">
                        <Button
                            class="size-fit py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="
                                () => {
                                    if (!field.state.value.includes(input)) {
                                        field.pushValue(input);
                                    }
                                    closeCombobox();
                                }
                            "
                        >
                            <PlusCircleIcon />
                            <span>Add</span>
                        </Button>
                    </template>
                </MultiSelectCombobox>

                <BadgeList :items="field.state.value" variant="outline">
                    <template #before="{ item }">
                        <MinusCircleIcon
                            role="button"
                            :size="16"
                            class="text-red-700 transition-all hover:scale-110 hover:cursor-pointer"
                            @click.prevent.stop="
                                () => {
                                    const valueIndex =
                                        field.state.value.indexOf(item);
                                    field.removeValue(valueIndex);
                                }
                            "
                        />
                    </template>
                </BadgeList>
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Have you had any major surgeries or hospital admissions?
                - if yes -> render textarea & request details
            -->

            <!-- Checkboxes - Do you have any long-term medical conditions? -->

            <!-- RadioGroup (binary) - Are you currently under the care of a hospital specialist? -->

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Are you currently taking any medication? 
                - if yes, render array field (as below) 
            -->

            <!-- Array Field - Medicine & Dosage
                - If previous answer is yes, render:
                    * array field with separate inputs for: medicine & dosage
                    * button -> dynamically add a set of inputs to the field array
            -->

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Do you have any allergies?
                - if yes, render array field (as below) 
            -->

            <!-- Array Field - Substance & Reaction/Symptoms
                - If previous answer is yes, render:
                    * array field with separate inputs for: Substance & Reaction/Symptoms
                    * button -> dynamically add a set of inputs to the field array
            -->

            <!-- ! Inputs for reference -->
            <Separator class="my-4" />

            <form.Field
                name="previousMedicalRecords.previousGP.address1"
                v-slot="{ field }"
            >
                <Input
                    class="max-w-sm"
                    placeholder="Address Line 1"
                    label="Might Delete Later"
                    id="prev-gp-address-line-1"
                    v-bind="getTextFieldProps(field)"
                    required
                />
            </form.Field>

            <!-- ! RadioGroup (binary) - Would you like us to request your medical records? -->
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
        </div>
    </div>
</template>
