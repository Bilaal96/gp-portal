<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Combobox, Input } from '@/components/form-inputs';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { FormStepProps } from '@/components/patient-registration/form-steps';

import { useDebugForm } from '@/composables/useDebugForm';
import { ONS_ETHNIC_GROUPS } from '@/lib/constants';

const props = defineProps<FormStepProps>();

const showOtherEthnicityInput = ref(false);
const ethnicGroupsMap = reactive(ONS_ETHNIC_GROUPS);

useDebugForm(props.form, {
    formStep: 'equalityAndAccessibility',
    label: 'Equality & Accessibility',
});
</script>
<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <div class="space-y-2">
            <!-- Ethnic Background
        
                Office for National Statistics (ONS) standard ethnic group categories 
                - https://www.ethnicity-facts-figures.service.gov.uk/style-guide/ethnic-groups/ 
            -->
            <div class="space-y-2">
                <form.Field
                    name="equalityAndAccessibility.ethnicity"
                    v-slot="{ field }"
                >
                    <Combobox
                        width="min-w-60"
                        label="What is your ethnic background?"
                        prompt="Specify ethnicity..."
                        empty-prompt="No matching ethnicity found."
                        placeholder="Search"
                        :options="ethnicGroupsMap"
                        :selected="field.state.value"
                        @update:selected="
                            (selectedValue) => {
                                props.form.setFieldValue(
                                    'equalityAndAccessibility.otherEthnicity',
                                    '',
                                );
                                const selectedEthnicity =
                                    selectedValue as string;

                                const isOtherEthnicGroup =
                                    selectedEthnicity.startsWith('Any other');

                                if (isOtherEthnicGroup) {
                                    console.log(selectedEthnicity);

                                    // field.handleChange('');
                                    showOtherEthnicityInput = true;
                                } else {
                                    showOtherEthnicityInput = false;
                                }
                                field.handleChange(selectedEthnicity);
                            }
                        "
                    >
                        <!-- Allows user to add unlisted ethnicity -->
                        <!-- <template #action="{ input, closeCombobox }">
                            <Button
                                class="size-fit py-1"
                                type="button"
                                size="sm"
                                @click.prevent.stop="
                                    () => {
                                        // Add other / unlisted ethnicity
                                        const otherKey = 'Other ethnic group';
                                        if (
                                            !ethnicGroupsMap[otherKey].includes(input)
                                        ) {
                                            ethnicGroupsMap[otherKey].push(input);
                                            field.handleChange(input);
                                        }
                                        closeCombobox();
                                    }
                                "
                            >
                                <PlusCircleIcon />
                                <span>Other</span>
                            </Button>
                        </template> -->
                    </Combobox>
                </form.Field>
            </div>

            <form.Field
                name="equalityAndAccessibility.otherEthnicity"
                v-slot="{ field }"
            >
                <!-- <Separator v-if="showOtherEthnicityInput" class="mb-4" /> -->
                <!-- Specify unlisted ethnicity -->
                <Input
                    v-if="showOtherEthnicityInput"
                    class="max-w-sm"
                    id="unlisted-ethnicity"
                    label="Please specify your ethnicity if not explicitly listed above:"
                    placeholder=""
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>
        </div>

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
