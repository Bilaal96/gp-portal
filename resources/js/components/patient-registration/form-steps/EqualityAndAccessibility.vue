<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Combobox, Input } from '@/components/form-inputs';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { FormStepProps } from '@/components/patient-registration/form-steps';
import { Separator } from '@/components/ui/separator';

import { useDebugForm } from '@/composables/useDebugForm';
import { ONS_ETHNIC_GROUPS, RELIGIOUS_BACKGROUNDS } from '@/lib/constants';

const props = defineProps<FormStepProps>();

// Track if an "other" option is selected
const selectedOtherEthnicity = ref<string | null>(null);
const selectedOtherReligion = ref(false);

const ethnicGroupsMap = reactive(ONS_ETHNIC_GROUPS);

useDebugForm(props.form, {
    formStep: 'equalityAndAccessibility',
    label: 'Equality & Accessibility',
});
</script>
<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- Wrapper around all inputs -->
        <div class="space-y-4">
            <!-- Ethnic Background
        
                Office for National Statistics (ONS) standard ethnic group categories 
                - https://www.ethnicity-facts-figures.service.gov.uk/style-guide/ethnic-groups/ 
            -->
            <form.Field
                name="equalityAndAccessibility.ethnicity"
                v-slot="{ field }"
            >
                <div class="space-y-4">
                    <Combobox
                        class="min-w-64"
                        label="What is your ethnic background?"
                        prompt="Specify ethnicity..."
                        empty-prompt="No matching ethnicity found."
                        placeholder="Search"
                        :options="ethnicGroupsMap"
                        :selected="selectedOtherEthnicity ?? field.state.value"
                        @update:selected="
                            (selectedEthnicity) => {
                                if (selectedEthnicity.startsWith('Any other')) {
                                    field.handleChange('');
                                    selectedOtherEthnicity = selectedEthnicity;
                                } else {
                                    selectedOtherEthnicity = null;
                                    field.handleChange(selectedEthnicity);
                                }
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

                    <!-- Specify unlisted ethnicity -->
                    <Input
                        v-if="selectedOtherEthnicity"
                        class="max-w-sm"
                        id="unlisted-ethnicity"
                        label="Please specify your ethnicity:"
                        v-bind="getTextFieldProps(field)"
                    />
                </div>
            </form.Field>

            <Separator class="my-4" />

            <!-- Religious / Spiritual Background
    
                Office for National Statistics (ONS) standard categories for religion 
                - https://www.ons.gov.uk/census/census2021dictionary/variablesbytopic/ethnicgroupnationalidentitylanguageandreligionvariablescensus2021/religiondetailed
            -->
            <form.Field
                name="equalityAndAccessibility.religiousBackground"
                v-slot="{ field }"
            >
                <div class="space-y-4">
                    <Combobox
                        class="min-w-64"
                        label="What is your religion / spiritual background?"
                        prompt="Specify religious background..."
                        empty-prompt="No matching religion / spiritual background found."
                        placeholder="Search"
                        :options="RELIGIOUS_BACKGROUNDS"
                        :selected="
                            selectedOtherReligion ? 'Other' : field.state.value
                        "
                        @update:selected="
                            (selectedValue) => {
                                if (selectedValue === 'Other') {
                                    field.handleChange('');
                                    selectedOtherReligion = true;
                                } else {
                                    field.handleChange(selectedValue);
                                    selectedOtherReligion = false;
                                }
                            }
                        "
                    />

                    <!-- Specify unlisted ethnicity -->
                    <Input
                        v-if="selectedOtherReligion"
                        class="max-w-sm"
                        id="unlisted-religion"
                        label="Please specify your religion / spiritual background:"
                        v-bind="getTextFieldProps(field)"
                    />
                </div>
            </form.Field>

            <Separator class="mb-4" />
        </div>
        <!-- End of wrapper around all inputs -->

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
