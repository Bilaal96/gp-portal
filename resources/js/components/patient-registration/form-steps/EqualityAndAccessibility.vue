<script setup lang="ts">
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import BadgeList from '@/components/BadgeList.vue';
import { Combobox, Input, RadioGroup } from '@/components/form-inputs';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { FormStepProps } from '@/components/patient-registration/form-steps';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useDebugForm } from '@/composables/useDebugForm';
import {
    ACCESSIBILITY_AIDS_AND_SUPPORT,
    LANGUAGES,
    ONS_ETHNIC_GROUPS,
    RELIGIOUS_BACKGROUNDS,
} from '@/lib/constants';

const props = defineProps<FormStepProps>();

// Track if an "other" option is selected
const selectedOtherEthnicity = ref<string | null>(null);
const selectedOtherReligion = ref(false);
const selectedOtherLanguage = ref<string | null>(null);

const ethnicGroupsMap = reactive(ONS_ETHNIC_GROUPS);

const requiresAidAndSupport = props.form.useStore(
    (state) => state.values.equalityAndAccessibility.requiresAidAndSupport,
);

useDebugForm(props.form, {
    formStep: 'equalityAndAccessibility',
    label: 'Equality & Accessibility',
});
</script>
<template>
    <div :id="props.id">
        <p class="mb-4">
            Everyone is valued. Help us to ensure that you get the best
            healthcare no matter where you're from or what your background is.
        </p>

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
                            (selectedEthnicity: string) => {
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
                            (selectedReligion: string) => {
                                if (selectedReligion === 'Other') {
                                    field.handleChange('');
                                    selectedOtherReligion = true;
                                } else {
                                    field.handleChange(selectedReligion);
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

            <!-- RadioGroup (binary) - Do you need any accessibility support for your appointments? -->
            <form.Field
                name="equalityAndAccessibility.requiresAidAndSupport"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="required-aid-and-support"
                    prompt="Do you need any accessibility support for your appointments?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) => {
                            // Clear previously specified required support
                            if (value === 'no') {
                                props.form.resetField(
                                    'equalityAndAccessibility.requiredAidAndSupport',
                                );
                            }

                            field.handleChange(value === 'yes' ? true : false);
                        }
                    "
                >
                    <template #subtext>
                        <p>
                            This helps us make any adjustments you may need when
                            visiting the practice.
                        </p>
                    </template>
                </RadioGroup>
            </form.Field>

            <!-- Combobox (multi-select) - What accessibility support or adjustments do you need? -->
            <div v-if="requiresAidAndSupport" class="space-y-2">
                <form.Field
                    name="equalityAndAccessibility.requiredAidAndSupport"
                    v-slot="{ field }"
                >
                    <Combobox
                        class="min-w-64"
                        label="What accessibility support or adjustments do you need?"
                        prompt="Specify required support..."
                        placeholder="Search or specify"
                        :options="ACCESSIBILITY_AIDS_AND_SUPPORT"
                        :selected="field.state.value"
                        @update:selected="
                            (selectedSupportRequirement) => {
                                const valueIndex = field.state.value.indexOf(
                                    selectedSupportRequirement,
                                );

                                if (valueIndex === -1) {
                                    field.pushValue(selectedSupportRequirement);
                                } else {
                                    field.removeValue(valueIndex);
                                }
                            }
                        "
                    >
                        <!-- Subtext -->
                        <template #subtext>
                            <p>
                                Select all that apply. You can also tell us in
                                your own words.
                            </p>
                        </template>

                        <!-- Allows user to add unlisted conditions -->
                        <template #action="{ input, closeCombobox }">
                            <Button
                                class="size-fit py-1"
                                type="button"
                                size="sm"
                                @click.prevent.stop="
                                    () => {
                                        if (
                                            !field.state.value.includes(input)
                                        ) {
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
                    </Combobox>

                    <!-- List of selected values -->
                    <template v-if="field.state.value.length">
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
                    </template>
                </form.Field>
            </div>

            <Separator class="mb-4" />

            <!-- Combobox (single select) -  Preferred language for healthcare -->
            <form.Field
                name="equalityAndAccessibility.preferredLanguage"
                v-slot="{ field }"
            >
                <div class="space-y-4">
                    <Combobox
                        class="min-w-64"
                        label="What is your preferred language for communication during healthcare?"
                        prompt="Specify language..."
                        empty-prompt="No matching language found."
                        placeholder="Search"
                        :options="LANGUAGES"
                        :selected="selectedOtherLanguage ?? field.state.value"
                        @update:selected="
                            (selectedLanguage: string) => {
                                if (selectedLanguage.startsWith('Other')) {
                                    field.handleChange('');
                                    selectedOtherLanguage = selectedLanguage;
                                } else {
                                    selectedOtherLanguage = null;
                                    field.handleChange(selectedLanguage);
                                }
                            }
                        "
                    />

                    <!-- Specify unlisted language -->
                    <Input
                        v-if="selectedOtherLanguage"
                        class="max-w-sm"
                        id="unlisted-language"
                        label="Please specify your preferred language manually:"
                        v-bind="getTextFieldProps(field)"
                    />
                </div>
            </form.Field>

            <!-- RadioGroup (binary) - Do you need an interpreter? -->
            <form.Field
                name="equalityAndAccessibility.requiresInterpreter"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="required-aid-and-support"
                    prompt="Do you need a language interpreter?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>
        </div>
        <!-- End of wrapper around all inputs -->
    </div>
</template>
