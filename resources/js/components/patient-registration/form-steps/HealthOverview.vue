<script setup lang="ts">
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import Checkbox from '@/components/form-inputs/Checkbox.vue';
import Input from '@/components/form-inputs/Input.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';
import { LONG_TERM_HEALTH_CONDITIONS } from '@/lib/constants';
import type { TanstackArrayField, TanstackField } from '@/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const props = defineProps<FormStepProps>();

// Toggles "Other" input for `longTermConditions` field
const showLongTermConditionsOther = ref(false);

const HEALTH_CONDITIONS = [
    'Asthma',
    'Autism',
    'Diabetes',
    'Heart Disease',
    'High Blood Pressure',
    'Learning Disability',
    'Mental Health Condition',
];

function addOtherHealthCondition(otherInputField: TanstackField) {
    const list = props.form.getFieldValue(
        'healthOverview.longTermConditions.others',
    );
    const newItem = otherInputField.state.value;

    // TODO: reject value & display feedback
    // No length/whitespace-only, or item exist already
    if (!newItem.trim().length || list.includes(newItem)) {
        otherInputField.setValue('');
        return;
    }

    /** REVIEW
     * One gotcha to be aware of: calling pushValue or removeValue does
     * not trigger onChange validation on the array field — validation
     * only runs if you manually set isTouched and call
     * field.validate('change'). GitHub That's a known bug worth keeping
     * in mind if you're adding validation to array fields. */
    props.form.pushFieldValue(
        'healthOverview.longTermConditions.others',
        newItem,
    );
    otherInputField.setValue('');
}

function removeOtherHealthCondition(field: TanstackArrayField, e: Event) {
    const deleteButton = e.target as unknown as HTMLOrSVGElement;

    const index = parseInt(deleteButton.dataset.index as string);

    console.log({
        index,
        strIndex: deleteButton.dataset.index as string,
        deleteButton,
    });

    field.removeValue(index);

    /* const otherCondition = deleteButton
        .dataset.value as string;

    const index =
        field.state.value.indexOf(
            otherCondition,
        );

    console.log({
        deleteButton,
        otherCondition,
        index,
    }); */
}

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, {
    formStep: 'healthOverview',
    label: props.title,
});

watch(showLongTermConditionsOther, (value) =>
    console.log({ showLongTermConditionsOther: value }),
);
</script>

<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- Do you have any long-term medical conditions? 
                - `longTermConditions.items` = Array of Fields 
                - `longTermConditions.other` = sub-field used to add fields to `longTermConditions.items`
            -->
            <p class="mb-2 ml-1 text-sm font-bold">
                Please inform us of any long term medical conditions that you
                have:
            </p>

            <Accordion type="multiple" collapsible class="mx-4">
                <template
                    v-for="(
                        categoryItems, categoryName
                    ) in LONG_TERM_HEALTH_CONDITIONS"
                    :key="categoryName"
                >
                    <AccordionItem :value="categoryName">
                        <AccordionTrigger>{{ categoryName }}</AccordionTrigger>
                        <AccordionContent>
                            <form.Field
                                name="healthOverview.longTermConditions.items"
                                v-slot="{ field }"
                            >
                                <template
                                    v-for="condition in categoryItems"
                                    :key="condition"
                                >
                                    <Checkbox
                                        :id="condition"
                                        :label="condition"
                                        @change="
                                            (checked) => {
                                                const selectedConditions =
                                                    field.state.value;

                                                if (checked) {
                                                    // add health condition to state
                                                    field.handleChange([
                                                        ...selectedConditions,
                                                        condition,
                                                    ]);
                                                } else {
                                                    // remove health condition from state
                                                    field.handleChange(
                                                        selectedConditions.filter(
                                                            (shc) =>
                                                                shc !==
                                                                condition,
                                                        ),
                                                    );
                                                }
                                            }
                                        "
                                    />
                                </template>
                            </form.Field>
                        </AccordionContent>
                    </AccordionItem>
                </template>
            </Accordion>

            <form.Field
                name="healthOverview.longTermConditions.items"
                v-slot="{ field }"
            >
                <template
                    v-for="(condition, i) in HEALTH_CONDITIONS"
                    :key="`${i}-${condition}`"
                >
                    <Checkbox
                        :id="condition"
                        :label="condition"
                        @change="
                            (checked) => {
                                const selectedConditions = field.state.value;

                                if (checked) {
                                    // add health condition to state
                                    field.handleChange([
                                        ...selectedConditions,
                                        condition,
                                    ]);
                                } else {
                                    // remove health condition from state
                                    field.handleChange(
                                        selectedConditions.filter(
                                            (shc) => shc !== condition,
                                        ),
                                    );
                                }
                            }
                        "
                    />
                </template>
            </form.Field>

            <form.Field
                name="healthOverview.longTermConditions.others"
                v-slot="{ field }"
            >
                <!-- REVIEW: possibly no longer needed
                    "Other" checkbox - toggles "Other" input
                    - not part of form state
                    - is UI state only
                -->
                <!-- <Checkbox
                    id="other"
                    label="Other - please specify:"
                    @change="
                        (checked) => (showLongTermConditionsOther = checked)
                    "
                /> -->
                <Label class="ml-7">Other - please specify:</Label>
                <ul v-if="field.state.value.length" class="ml-10">
                    <template
                        v-for="(item, i) in field.state.value"
                        :key="`${i}-${item}`"
                    >
                        <li class="">
                            <div class="flex items-center gap-4">
                                <MinusCircleIcon
                                    :data-value="item"
                                    :data-index="i"
                                    role="button"
                                    alt="Delete"
                                    :size="16"
                                    class="text-red-700 hover:scale-110 hover:cursor-pointer"
                                    @click.prevent.stop="
                                        removeOtherHealthCondition(
                                            field,
                                            $event,
                                        )
                                    "
                                />
                                <span>{{ item }}</span>
                            </div>
                        </li>
                    </template>
                </ul>

                <!-- "Other" input & "Add" button - allows you to add a checkbox for an unlisted health condition -->
                <!-- v-if="showLongTermConditionsOther" -->
                <form.Field
                    name="healthOverview.longTermConditions.other"
                    v-slot="{ field: otherField }"
                >
                    <div class="ml-7 flex gap-1">
                        <Input
                            class="max-w-sm"
                            id="other-long-term-condition"
                            placeholder="Specify condition"
                            v-bind="getTextFieldProps(otherField)"
                            @keyup.prevent.enter="
                                addOtherHealthCondition(otherField)
                            "
                        />

                        <Button
                            type="button"
                            class="self-end"
                            @click="addOtherHealthCondition(otherField)"
                        >
                            <PlusCircleIcon />
                            <span>Add</span>
                        </Button>
                    </div>
                </form.Field>
            </form.Field>

            <!-- Other(s): Array Field
                - dynamically add other long-term medical conditions that aren't listed
            -->

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
