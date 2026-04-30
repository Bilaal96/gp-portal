<script setup lang="ts">
import { ref } from 'vue';

import Input from '@/components/form-inputs/Input.vue';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { FormStepProps } from '@/components/patient-registration/form-steps';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';
import { ONS_ETHNIC_GROUPS } from '@/lib/constants';

const props = defineProps<FormStepProps>();

const showOtherEthnicityInput = ref(false);

useDebugForm(props.form, {
    formStep: 'equalityAndAccessibility',
    label: 'Equality & Accessibility',
});
</script>
<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- Ethnic Background
        
            Office for National Statistics (ONS) standard ethnic group categories 
            - https://www.ethnicity-facts-figures.service.gov.uk/style-guide/ethnic-groups/ 

            An Accordion whose AccordionItems each list a category of ethnic groups.
            Expanding the category reveals a list of radio inputs 
            - one for each ethnicity within the expanded category.
        -->
        <p class="mb-2 text-sm font-bold">
            Please select the option that best describes your ethnicity:
        </p>
        <form.Field
            name="equalityAndAccessibility.ethnicity"
            v-slot="{ field }"
        >
            <Accordion type="single" collapsible class="w-full">
                <RadioGroup
                    class="gap-0"
                    default-value=""
                    @update:model-value="
                        (value) => {
                            const selectedEthnicity = value as string;

                            const isOtherEthnicGroup =
                                selectedEthnicity.startsWith('Any other');

                            if (isOtherEthnicGroup) {
                                console.log(selectedEthnicity);

                                field.handleChange('');
                                showOtherEthnicityInput = true;
                            } else {
                                showOtherEthnicityInput = false;
                                field.handleChange(selectedEthnicity);
                            }
                        }
                    "
                >
                    <template
                        v-for="(
                            ethnicGroupsList, ethnicGroupCategory
                        ) in ONS_ETHNIC_GROUPS"
                        :key="ethnicGroupCategory"
                    >
                        <AccordionItem :value="ethnicGroupCategory">
                            <AccordionTrigger class="px-4">{{
                                ethnicGroupCategory
                            }}</AccordionTrigger>
                            <AccordionContent class="space-y-2">
                                <div
                                    v-for="ethnicGroup in ethnicGroupsList"
                                    class="ml-6 flex items-center gap-2"
                                    :key="ethnicGroup"
                                >
                                    <RadioGroupItem
                                        :id="ethnicGroup"
                                        :value="ethnicGroup"
                                    />
                                    <Label :for="ethnicGroup">{{
                                        ethnicGroup
                                    }}</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </template>
                </RadioGroup>
            </Accordion>

            <!-- Specify unlisted ethnicity -->
            <Separator v-if="showOtherEthnicityInput" class="mb-4" />
            <Input
                v-if="showOtherEthnicityInput"
                class="max-w-sm"
                id="unlisted-ethnicity"
                label="Please specify your ethnicity if not explicitly listed above"
                placeholder=""
                v-bind="getTextFieldProps(field)"
            />
        </form.Field>

        <!-- ! For reference only -->
        <!-- <div class="ml-2">
            <RadioGroup
                :default-value
                @update:model-value="(value) => $emit('change', value)"
            >
                <div
                    v-for="{ id, label, value } in props.options"
                    class="flex items-center gap-2"
                    :key="id"
                >
                    <RadioGroupItem :id :value />
                    <Label :for="id">{{ label }}</Label>
                </div>
            </RadioGroup>
        </div> -->
    </div>
</template>
