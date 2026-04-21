<script setup lang="ts">
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-vue-next';
import { reactive } from 'vue';
import BadgeList from '@/components/BadgeList.vue';
import {
    Input,
    MultiSelectCombobox,
    RadioGroup,
    Textarea,
} from '@/components/form-inputs';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import { type FormStepProps } from '@/components/patient-registration/form-steps';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useDebugForm } from '@/composables/useDebugForm';
import { useDebugReactive } from '@/composables/useDebugReactive';
import { LONG_TERM_HEALTH_CONDITIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const props = defineProps<FormStepProps>();

const majorIncidents = reactive({
    showFormFields: true,
    title: '',
    reason: '',
    details: '',
});

function resetMajorIncidentsFormFields() {
    majorIncidents.title = '';
    majorIncidents.reason = '';
    majorIncidents.details = '';
}

function resetMajorIncidents() {
    resetMajorIncidentsFormFields();
    majorIncidents.showFormFields = false;
}

// REVIEW: should I refactor to use reactive local state - will be more concise
// Used to conditionally render other fields
const hasLongTermConditions = props.form.useStore(
    (state) => state.values.healthOverview.hasLongTermCondition,
);

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, {
    formStep: 'healthOverview',
    label: props.title,
});

useDebugReactive(majorIncidents, 'majorIncidents (Reactive):');
</script>

<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- RadioGroup (binary) - Do you have any long-term medical conditions? -->
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

            <!-- MultiSelectCombobox - Specify long-term medical conditions -->
            <form.Field
                v-if="hasLongTermConditions"
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

            <!-- 
                Please inform us of any major medical procedures or events that
                have occurred
                
                Collect incident details
                - title - Input 
                - reason - Input 
                - details - textarea

                Buttons
                - Add Incident - shows form fields + toggles show state to true
                - Log Incident - push field values to tanstack form state + reset majorIncidents state
                - Cancel - reset majorIncidents state
            -->
            <p class="mb-4 ml-1 text-sm font-bold">
                Please inform us of any major medical procedures or events that
                have occurred - e.g. major surgeries or hospital admissions.
            </p>
            <Button
                v-if="majorIncidents.showFormFields === false"
                class="ml-2 size-fit py-1"
                type="button"
                @click.prevent.stop="majorIncidents.showFormFields = true"
            >
                <PlusCircleIcon />
                <span>Incident</span>
            </Button>

            <!-- Array Field - majorIncidents -->
            <form.Field name="healthOverview.majorIncidents" v-slot="{ field }">
                <template v-if="majorIncidents.showFormFields">
                    <div class="space-y-4">
                        <!-- Title -->
                        <Input
                            class="max-w-sm"
                            label="Incident Title"
                            placeholder="Give a name to the incident"
                            id="incident-title"
                            name="incident-title"
                            :value="majorIncidents.title"
                            @input="majorIncidents.title = $event.target.value"
                        />

                        <!-- Reason -->
                        <Input
                            class="max-w-sm"
                            label="Incident Reason"
                            placeholder="Brief description of the incident"
                            id="incident-reason"
                            name="incident-reason"
                            :value="majorIncidents.reason"
                            @input="majorIncidents.reason = $event.target.value"
                        />

                        <!-- Details -->
                        <Textarea
                            class="min-h-24 max-w-sm"
                            id="incident-details"
                            label="Incident Details"
                            placeholder="Provide additional information..."
                            name="incident-details"
                            :value="majorIncidents.details"
                            @input="
                                majorIncidents.details = $event.target.value
                            "
                        />
                    </div>
                    <div class="ml-2 flex items-center gap-2">
                        <Button
                            class="size-fit cursor-pointer py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="
                                () => {
                                    const { title, reason, details } =
                                        majorIncidents;

                                    if (title && reason && details) {
                                        // Log
                                        field.pushValue({
                                            title,
                                            reason,
                                            details,
                                        });
                                        resetMajorIncidents();
                                    } else {
                                        // Reject Log
                                        // TODO user input validation/feedback
                                        console.warn(
                                            'Major incidents: must fill in all fields',
                                        );
                                    }
                                }
                            "
                        >
                            <PlusCircleIcon />
                            <span>Log Incident</span>
                        </Button>
                        <Button
                            class="size-fit cursor-pointer py-1"
                            variant="destructive"
                            type="button"
                            size="sm"
                            @click.prevent.stop="resetMajorIncidents()"
                        >
                            <span>Cancel</span>
                        </Button>
                    </div>
                </template>

                <Accordion collapsible v-slot="{ modelValue }">
                    <AccordionItem value="logged incidents">
                        <AccordionTrigger
                            :class="
                                cn('mb-1 bg-primary/30 px-4', {
                                    'text-muted-foreground':
                                        modelValue === 'logged incidents',
                                })
                            "
                        >
                            Logged Incidents
                        </AccordionTrigger>
                        <AccordionContent class="rounded-sm bg-primary/10">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <!-- Logged incidents -->
                                <TableBody v-if="field.state.value.length">
                                    <TableRow
                                        v-for="(
                                            incident, incidentIndex
                                        ) in field.state.value"
                                        :key="incidentIndex"
                                    >
                                        <TableCell>
                                            {{ incident.title }}
                                        </TableCell>
                                        <TableCell>
                                            {{ incident.details }}
                                        </TableCell>
                                        <TableCell>
                                            {{ incident.reason }}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                                <!-- No logs (empty table) -->
                                <TableBody v-else>
                                    <TableRow>
                                        <TableCell
                                            colspan="3"
                                            class="h-20 text-center"
                                        >
                                            No incidents logged
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Are you currently under the care of a hospital specialist? -->

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
        </div>
    </div>
</template>
