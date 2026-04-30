<script setup lang="ts">
import {
    EditIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    SaveIcon,
    Trash2Icon,
} from 'lucide-vue-next';
import { ref, nextTick, useTemplateRef } from 'vue';
import BadgeList from '@/components/BadgeList.vue';
import {
    Combobox,
    Input,
    RadioGroup,
    Textarea,
} from '@/components/form-inputs';
import {
    binaryRadioGroup,
    createRadioGroupOptions,
} from '@/components/form-inputs/radio-group/utils';
import { getNumberFieldProps } from '@/components/form-inputs/utils';
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
import useDraft from '@/composables/useDraft';
import { LONG_TERM_HEALTH_CONDITIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { TanstackArrayField } from '@/types';

const props = defineProps<FormStepProps>();

// Conditionally renders longTermConditions multiselect Combobox field
const hasLongTermConditions = ref<boolean | undefined>(undefined);

const majorIncidentDraft = useDraft(
    {
        title: '',
        reason: '',
        details: '',
    },
    'majorIncident',
);

const medicationDraft = useDraft(
    {
        name: '',
        dosage: '',
        purpose: '',
    },
    'medication',
);

// Used to manually focus first draft field when entering edit mode
const incidentTitleInput = useTemplateRef('incident-title');
const medicationNameInput = useTemplateRef('medication-name');

// Controls Accordion state for logged incidents
const loggedIncidentsAccordion = ref<'show-incidents' | undefined>(undefined);
const medicationRecordAccordion = ref<'show-medication' | undefined>(undefined);

// Form state selectors
const alcoholConsumptionFrequency = props.form.useStore(
    (state) => state.values.healthOverview.alcoholConsumption.frequency,
);

/* ------------------ Handle Draft Fields: Major Incidents ------------------ */
function logMajorIncident(
    field: TanstackArrayField<typeof majorIncidentDraft.draft.value>,
) {
    const { title, reason, details } = majorIncidentDraft.draft.value;

    if (title && reason && details) {
        // Log
        field.pushValue({
            title,
            reason,
            details,
        });
        majorIncidentDraft.resetDraftFields();
        loggedIncidentsAccordion.value = 'show-incidents';
    } else {
        // Reject Log
        // TODO user input validation/feedback
        console.warn('Major incidents: must fill in all fields');
    }
}

async function showEditMajorIncidentView(
    incidentIndex: number,
    incident: typeof majorIncidentDraft.draft.value,
) {
    majorIncidentDraft.showEditView(incidentIndex, incident);

    // Focus title input
    await nextTick(); // Ensures the input exists in DOM
    incidentTitleInput.value?.input?.focus();
}

function updateMajorIncident(
    field: TanstackArrayField<typeof majorIncidentDraft.draft.value>,
) {
    const { title, reason, details } = majorIncidentDraft.draft.value;
    const { isEditing, editIndex } = majorIncidentDraft;

    if (title && reason && details && isEditing(editIndex.value)) {
        // Edit Log
        field.replaceValue(editIndex.value, {
            title,
            reason,
            details,
        });
        majorIncidentDraft.resetDraftFields();
        loggedIncidentsAccordion.value = 'show-incidents';
    } else {
        // Reject Edit
        // TODO user input validation/feedback
        console.warn('Major incidents: must fill in all fields');
    }
}

function deleteMajorIncident(
    field: TanstackArrayField<typeof majorIncidentDraft.draft.value>,
    incidentIndex: number,
) {
    // If item to delete is being edited, exit edit mode
    if (majorIncidentDraft.editIndex.value === incidentIndex) {
        majorIncidentDraft.resetDraftFields();
    }

    field.removeValue(incidentIndex);
}

/* --------------------- Handle Draft Fields: Medication -------------------- */
function addMedicationEntry(
    field: TanstackArrayField<typeof medicationDraft.draft.value>,
) {
    const { name, dosage, purpose } = medicationDraft.draft.value;

    if (name && dosage && purpose) {
        // Add Entry
        field.pushValue({
            name,
            dosage,
            purpose,
        });
        medicationDraft.resetDraftFields();
        medicationRecordAccordion.value = 'show-medication';
    } else {
        // Reject Entry
        // TODO user input validation/feedback
        console.warn('Medication: must fill in all fields');
    }
}

async function showEditMedicationEntryView(
    medicationEntryIndex: number,
    medicationEntry: typeof medicationDraft.draft.value,
) {
    medicationDraft.showEditView(medicationEntryIndex, medicationEntry);

    // Focus name input
    await nextTick(); // Ensures the input exists in DOM
    medicationNameInput.value?.input?.focus();
}

function updateMedicationEntry(
    field: TanstackArrayField<typeof medicationDraft.draft.value>,
) {
    const { name, dosage, purpose } = medicationDraft.draft.value;
    const { editIndex, isEditing } = medicationDraft;

    if (name && dosage && purpose && isEditing(editIndex.value)) {
        // Edit Entry
        field.replaceValue(editIndex.value, {
            name,
            dosage,
            purpose,
        });
        medicationDraft.resetDraftFields();
        medicationRecordAccordion.value = 'show-medication';
    } else {
        // Reject Edit
        // TODO user input validation/feedback
        console.warn('Medication: must fill in all fields');
    }
}

function deleteMedicationEntry(
    field: TanstackArrayField<typeof medicationDraft.draft.value>,
    medicationEntryIndex: number,
) {
    // If item to delete is being edited, exit edit mode
    if (medicationDraft.editIndex.value === medicationEntryIndex) {
        medicationDraft.resetDraftFields();
    }

    field.removeValue(medicationEntryIndex);
}

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, { formStep: 'healthOverview', label: props.title });
</script>

<template>
    <div :id="props.id">
        <h1 class="mb-2 text-2xl font-bold">{{ props.title }}</h1>

        <!-- All Questions -->
        <div class="space-y-4">
            <!-- RadioGroup (binary) - Do you have any long-term medical conditions? -->
            <RadioGroup
                id="has-long-term-condition"
                prompt="Do you have any long-term medical conditions?"
                :options="binaryRadioGroup()"
                @change="
                    (value) => {
                        if (value === 'yes') {
                            hasLongTermConditions = true;
                        } else {
                            hasLongTermConditions = false;
                        }
                    }
                "
            />

            <!-- Multiselect Combobox - Specify long-term medical conditions -->
            <form.Field
                v-if="hasLongTermConditions"
                name="healthOverview.longTermConditions"
                v-slot="{ field }"
            >
                <Combobox
                    label="Please inform us of any long-term medical conditions that you have:"
                    prompt="Specify long-term medical conditions..."
                    empty-prompt="No matching conditions found."
                    placeholder="Search or specify"
                    :options="LONG_TERM_HEALTH_CONDITIONS"
                    :selected="field.state.value"
                    @update:selected="
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
                </Combobox>

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
                v-if="majorIncidentDraft.showDraftFields.value === false"
                class="ml-2 size-fit py-1"
                type="button"
                @click.prevent.stop="
                    majorIncidentDraft.showDraftFields.value = true
                "
            >
                <PlusCircleIcon />
                <span>Incident</span>
            </Button>

            <!-- Array Field - majorIncidents -->
            <form.Field name="healthOverview.majorIncidents" v-slot="{ field }">
                <template v-if="majorIncidentDraft.showDraftFields.value">
                    <div class="space-y-4">
                        <!-- Title -->
                        <Input
                            ref="incident-title"
                            class="max-w-sm"
                            label="Incident Title"
                            placeholder="Give a name to the incident"
                            id="incident-title"
                            name="incident-title"
                            :value="majorIncidentDraft.draft.value.title"
                            @input="
                                majorIncidentDraft.draft.value.title =
                                    $event.target.value
                            "
                        />

                        <!-- Reason -->
                        <Input
                            class="max-w-sm"
                            label="Incident Reason"
                            placeholder="Brief description of the incident"
                            id="incident-reason"
                            name="incident-reason"
                            :value="majorIncidentDraft.draft.value.reason"
                            @input="
                                majorIncidentDraft.draft.value.reason =
                                    $event.target.value
                            "
                        />

                        <!-- Details -->
                        <Textarea
                            class="min-h-24 max-w-sm"
                            label="Incident Details"
                            placeholder="Provide additional information..."
                            id="incident-details"
                            name="incident-details"
                            :value="majorIncidentDraft.draft.value.details"
                            @input="
                                majorIncidentDraft.draft.value.details =
                                    $event.target.value
                            "
                        />
                    </div>
                    <div class="ml-2 flex items-center gap-2">
                        <!-- Save Edit -->
                        <Button
                            v-if="majorIncidentDraft.isEditing()"
                            class="size-fit cursor-pointer py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="updateMajorIncident(field)"
                        >
                            <SaveIcon />
                            <span>Save</span>
                        </Button>
                        <!-- or Add New Incident -->
                        <Button
                            v-else
                            class="size-fit cursor-pointer py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="logMajorIncident(field)"
                        >
                            <PlusCircleIcon />
                            <span>Log Incident</span>
                        </Button>

                        <Button
                            class="size-fit cursor-pointer py-1"
                            variant="destructive"
                            type="button"
                            size="sm"
                            @click.prevent.stop="
                                majorIncidentDraft.resetDraftFields()
                            "
                        >
                            <span>Cancel</span>
                        </Button>
                    </div>
                </template>

                <Accordion
                    collapsible
                    v-model="loggedIncidentsAccordion"
                    v-slot="{ modelValue }"
                >
                    <AccordionItem value="show-incidents">
                        <AccordionTrigger
                            :class="
                                cn('mb-1 bg-primary/30 px-4', {
                                    'text-muted-foreground':
                                        modelValue === 'logged-incidents',
                                })
                            "
                        >
                            Logged Incidents
                        </AccordionTrigger>
                        <AccordionContent class="rounded-md bg-primary/10">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead class="text-right">
                                            Actions
                                        </TableHead>
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
                                            {{ incident.reason }}
                                        </TableCell>
                                        <TableCell>
                                            {{ incident.details }}
                                        </TableCell>
                                        <TableCell
                                            class="align-right flex flex-wrap justify-end gap-2"
                                        >
                                            <EditIcon
                                                v-if="
                                                    incidentIndex !==
                                                    majorIncidentDraft.editIndex
                                                        .value
                                                "
                                                class="cursor-pointer transition-colors hover:text-secondary"
                                                :size="16"
                                                @click="
                                                    showEditMajorIncidentView(
                                                        incidentIndex,
                                                        incident,
                                                    )
                                                "
                                            />
                                            <Trash2Icon
                                                class="cursor-pointer transition-colors hover:text-red-700"
                                                :size="16"
                                                @click="
                                                    deleteMajorIncident(
                                                        field,
                                                        incidentIndex,
                                                    )
                                                "
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                                <!-- No logs (empty table) -->
                                <TableBody v-else>
                                    <TableRow>
                                        <TableCell
                                            colspan="4"
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
            <form.Field
                name="healthOverview.isUnderSpecialistCare"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="is-under-specialist-care"
                    prompt="Are you currently under the care of a hospital specialist?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <Separator class="my-4" />

            <!-- Array field - Medication, Dosage & Purpose
             
                Are you currently taking any medication? This includes oral & topical medicine for short & long term conditions, as well as allergy treatment.
                - Add Medication button - reveals draft form (like majorIncidents - see above)

                Operations
                - Draft form 
                    - submission - adds to array field: medicationAndDosage
                    - cancel - clears & hides the form

                    Fields
                    - Name of Medication
                    - Dosage
                    - Purpose (aka Indication) - provide symptoms


                - Accordion & Table
                    - reveal on submission of new entry
                    - display entries for medication & dosages
                    - allow edit & deletion of entries
            -->
            <p class="mb-4 ml-1 text-sm font-bold">
                Are you currently taking any medication? This includes oral &
                topical medicine for short & long term conditions, as well as
                allergy treatment.
            </p>
            <Button
                v-if="medicationDraft.showDraftFields.value === false"
                class="ml-2 size-fit py-1"
                type="button"
                @click.prevent.stop="
                    medicationDraft.showDraftFields.value = true
                "
            >
                <PlusCircleIcon />
                <span>Medication</span>
            </Button>

            <form.Field name="healthOverview.medication" v-slot="{ field }">
                <template v-if="medicationDraft.showDraftFields.value">
                    <div class="space-y-4">
                        <!-- Name -->
                        <Input
                            ref="medication-name"
                            class="max-w-sm"
                            label="Name of Medicine"
                            id="medication-name"
                            name="medication-name"
                            :value="medicationDraft.draft.value.name"
                            @input="
                                medicationDraft.draft.value.name =
                                    $event.target.value
                            "
                        />

                        <!-- Dosage -->
                        <Input
                            class="max-w-sm"
                            label="Dosage (include units)"
                            placeholder="e.g. 500mg"
                            id="medication-dosage"
                            name="medication-dosage"
                            :value="medicationDraft.draft.value.dosage"
                            @input="
                                medicationDraft.draft.value.dosage =
                                    $event.target.value
                            "
                        />

                        <!-- Purpose -->
                        <Textarea
                            class="min-h-24 max-w-sm"
                            label="Purpose"
                            placeholder="What diagnoses or symptoms are being treated?"
                            id="medication-purpose"
                            name="medication-purpose"
                            :value="medicationDraft.draft.value.purpose"
                            @input="
                                medicationDraft.draft.value.purpose =
                                    $event.target.value
                            "
                        />
                    </div>

                    <div class="ml-2 flex items-center gap-2">
                        <!-- Save Edit -->
                        <Button
                            v-if="medicationDraft.isEditing()"
                            class="size-fit cursor-pointer py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="updateMedicationEntry(field)"
                        >
                            <SaveIcon />
                            <span>Save</span>
                        </Button>
                        <!-- or Add New Medication -->
                        <Button
                            v-else
                            class="size-fit cursor-pointer py-1"
                            type="button"
                            size="sm"
                            @click.prevent.stop="addMedicationEntry(field)"
                        >
                            <PlusCircleIcon />
                            <span>Record Medication</span>
                        </Button>

                        <Button
                            class="size-fit cursor-pointer py-1"
                            variant="destructive"
                            type="button"
                            size="sm"
                            @click.prevent.stop="
                                medicationDraft.resetDraftFields()
                            "
                        >
                            <span>Cancel</span>
                        </Button>
                    </div>
                </template>

                <Accordion
                    collapsible
                    v-model="medicationRecordAccordion"
                    v-slot="{ modelValue }"
                >
                    <AccordionItem value="show-medication">
                        <AccordionTrigger
                            :class="
                                cn('mb-1 bg-primary/30 px-4', {
                                    'text-muted-foreground':
                                        modelValue === 'listed-medication',
                                })
                            "
                        >
                            Medication Record
                        </AccordionTrigger>
                        <AccordionContent class="rounded-md bg-primary/10">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Dosage</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead class="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <!-- Listed Medication -->
                                <TableBody v-if="field.state.value.length">
                                    <TableRow
                                        v-for="(
                                            medicationEntry,
                                            medicationEntryIndex
                                        ) in field.state.value"
                                        :key="medicationEntryIndex"
                                    >
                                        <TableCell>
                                            {{ medicationEntry.name }}
                                        </TableCell>
                                        <TableCell>
                                            {{ medicationEntry.dosage }}
                                        </TableCell>
                                        <TableCell>
                                            {{ medicationEntry.purpose }}
                                        </TableCell>
                                        <TableCell
                                            class="align-right flex flex-wrap justify-end gap-2"
                                        >
                                            <EditIcon
                                                v-if="
                                                    medicationEntryIndex !==
                                                    medicationDraft.editIndex
                                                        .value
                                                "
                                                class="cursor-pointer transition-colors hover:text-secondary"
                                                :size="16"
                                                @click="
                                                    showEditMedicationEntryView(
                                                        medicationEntryIndex,
                                                        medicationEntry,
                                                    )
                                                "
                                            />
                                            <Trash2Icon
                                                class="cursor-pointer transition-colors hover:text-red-700"
                                                :size="16"
                                                @click="
                                                    deleteMedicationEntry(
                                                        field,
                                                        medicationEntryIndex,
                                                    )
                                                "
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                                <!-- No Medication Listed (empty table) -->
                                <TableBody v-else>
                                    <TableRow>
                                        <TableCell
                                            colspan="4"
                                            class="h-20 text-center"
                                        >
                                            No medication recorded
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </form.Field>

            <Separator class="my-4" />

            <!-- Number Inputs - Height & Weight -->
            <form.Field name="healthOverview.height" v-slot="{ field }">
                <Input
                    type="number"
                    class="max-w-max"
                    label="Height (cm)"
                    id="height"
                    v-bind="getNumberFieldProps(field)"
                    min="0"
                    required
                />
            </form.Field>
            <form.Field name="healthOverview.weight" v-slot="{ field }">
                <Input
                    type="number"
                    class="max-w-max"
                    label="Weight (kg)"
                    id="weight"
                    v-bind="getNumberFieldProps(field)"
                    min="0"
                    required
                />
            </form.Field>

            <!-- RadioGroup - Exercise Frequency -->
            <form.Field
                name="healthOverview.exerciseFrequency"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="exercise-frequency-radio-group"
                    prompt="How often do you exercise per week?"
                    :options="
                        createRadioGroupOptions([
                            {
                                id: 'never',
                                label: 'I don\'t exercise',
                                value: 'never',
                            },
                            '1-2 sessions per week',
                            '3-4 sessions per week',
                            '5-6 sessions per week',
                            'daily',
                        ])
                    "
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup - Do you currently smoke cigarettes or have you smoked in the past? -->
            <form.Field name="healthOverview.smokingHistory" v-slot="{ field }">
                <RadioGroup
                    id="smoking-history-radio-group"
                    prompt="Do you currently smoke cigarettes or have you smoked in the past?"
                    :options="
                        createRadioGroupOptions([
                            {
                                id: 'current-smoker',
                                label: 'I currently smoke cigarettes',
                                value: 'current smoker',
                            },
                            {
                                id: 'past-smoker',
                                label: 'I quit smoking cigarettes',
                                value: 'past smoker',
                            },
                            {
                                id: 'never-smoked',
                                label: 'I have never smoked cigarettes',
                                value: 'never smoked',
                            },
                        ])
                    "
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>

            <Separator class="my-4" />

            <!-- RadioGroup - Drinking frequency (drinks consumed per week) -->
            <form.Field
                name="healthOverview.alcoholConsumption.frequency"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="alcohol-consumption-frequency-radio-group"
                    prompt="How often do you have a drink containing alcohol?"
                    :options="
                        createRadioGroupOptions([
                            {
                                id: 'four-or-more-per-week',
                                label: '4+ times per week',
                                value: '4 or more per week',
                            },
                            {
                                id: 'three-per-week',
                                label: '3 times per week',
                                value: '3 per week',
                            },
                            {
                                id: 'two-per-week',
                                label: '2 times per week',
                                value: '2 per week',
                            },
                            {
                                id: 'once-per-week',
                                label: '1 time per week',
                                value: '1 per week',
                            },
                            'never',
                        ])
                    "
                    @change="(value) => field.handleChange(value)"
                />
            </form.Field>

            <template
                v-if="!['never', ''].includes(alcoholConsumptionFrequency)"
            >
                <!-- RadioGroup - drinking quantity - number of drinks consumed on a typical drinking day -->
                <form.Field
                    name="healthOverview.alcoholConsumption.quantity"
                    v-slot="{ field }"
                >
                    <RadioGroup
                        id="alcohol-consumption-quantity-radio-group"
                        prompt="How many standard drinks do you have on a typical day when you are drinking?"
                        :options="
                            createRadioGroupOptions([
                                '9+ Units',
                                '7-8 Units',
                                '5-6 Units',
                                '3-4 Units',
                                '1-2 Units',
                            ])
                        "
                        @change="(value) => field.handleChange(value)"
                    >
                        <template #subtext>
                            <p class="mb-1 ml-1 text-muted-foreground">
                                Please use these guidelines in regards to what
                                constitutes a "standard drink":
                            </p>
                            <ul
                                class="ml-6 list-disc space-y-1 text-muted-foreground"
                            >
                                <li>
                                    1 Unit/Drink: ½ pint of beer, small glass of
                                    wine, or a single shot.
                                </li>
                                <li>
                                    2 Units/Drinks: 1 pint of beer or medium
                                    wine (175ml).
                                </li>
                                <li>9 Units/Drinks: A full bottle of wine.</li>
                            </ul>
                        </template>
                    </RadioGroup>
                </form.Field>

                <!-- RadioGroup - binge drinking frequency - no. of times 6+ drinks are consumed on one occasion -->
                <form.Field
                    name="healthOverview.alcoholConsumption.bingeFrequency"
                    v-slot="{ field }"
                >
                    <RadioGroup
                        id="alcohol-consumption-binge-frequency-radio-group"
                        prompt="How often do you have six or more drinks on one occasion?"
                        :options="
                            createRadioGroupOptions([
                                'daily',
                                '5-6 times per week',
                                '3-4 times per week',
                                '1-2 times per week',
                                'never',
                            ])
                        "
                        @change="(value) => field.handleChange(value)"
                    />
                </form.Field>
            </template>

            <Separator class="my-4" />

            <!-- RadioGroup (binary) - Do you use recreational drugs? -->
            <form.Field
                name="healthOverview.usesRecreationalDrugs"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="uses-recreational-drugs-radio-group"
                    prompt="Do you use recreational drugs?"
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
