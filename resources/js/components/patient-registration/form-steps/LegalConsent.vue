<script setup lang="ts">
import { Input } from '@/components/form-inputs';
import Checkbox from '@/components/form-inputs/Checkbox.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { FormStepProps } from '@/components/patient-registration/form-steps';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';

const props = defineProps<FormStepProps>();

const DATA_SHARING_OPTIONS = [
    {
        id: 'direct-care',
        label: 'I consent to the use of my data for Direct Care',
        value: 'Direct Care',
    },
    {
        id: 'nhs-planning',
        label: 'I consent to the use of my data for NHS Planning',
        value: 'NHS Planning',
    },
];

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, { formStep: 'legalConsent', label: props.title });
</script>
<template>
    <div :class="props.id">
        <ul class="mb-4 list-disc *:ml-6 *:text-sm">
            The necessary legal stuff. Please confirm the following:
            <li>how you'd like us to contact you;</li>
            <li>
                whether you'd like to opt-in to data sharing (for your direct
                and/or indirect benefit);
            </li>
            <li>
                that all the information you have provided is accurate & true.
            </li>
        </ul>

        <div class="space-y-4">
            <!-- RadioGroup (binary) - Do you consent to us contacting you by SMS/email? -->
            <form.Field
                name="legalConsent.canContactViaSmsOrEmail"
                v-slot="{ field }"
            >
                <RadioGroup
                    id="can-sms-or-email"
                    prompt="Do you consent to us contacting you by SMS and/or email?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value: 'yes' | 'no') =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                >
                    <template #subtext>
                        <p class="text-muted-foreground">
                            These contact methods are required for appointment
                            bookings, updates & emergency health alerts.
                        </p>
                    </template>
                </RadioGroup>
            </form.Field>

            <Separator class="my-4" />

            <!-- Do you consent to data sharing for:
                - direct care
                - NHS planning (opt-out available)
            -->
            <form.Field name="legalConsent.dataSharing" v-slot="{ field }">
                <p class="mb-2 ml-1 text-sm font-bold">
                    Do you consent to data sharing for Direct Care and/or NHS
                    Planning?
                </p>
                <ul
                    class="mb-3 ml-6 list-disc space-y-2 text-xs text-muted-foreground"
                >
                    <li>
                        Direct Care - any data collected can be used (by
                        healthcare professionals) to provide you with the best
                        possible direct treatment. This may include:
                        <ul class="ml-5 list-disc">
                            <li class="mt-1">
                                Your GP sharing your record with a hospital
                                specialist
                            </li>
                            <li>A pharmacist seeing your prescriptions</li>
                            <li>
                                NHS 111 accessing your details in an emergency
                            </li>
                        </ul>
                    </li>
                    <li>
                        NHS Planning & Research - any data collected can be used
                        (by the NHS, researchers, and public health bodies) to
                        improve services, plan resources, and conduct research;
                        not to treat you directly. Example data usage includes:
                        <ul class="ml-5 list-disc">
                            <li class="mt-1">
                                Deciding where new GP clinics are needed
                            </li>
                            <li>
                                Studying disease trends (e.g., diabetes rates)
                            </li>
                            <li>Improving waiting times</li>
                            <li>Public health research</li>
                        </ul>
                    </li>
                </ul>
                <template
                    v-for="dataSharingOption in DATA_SHARING_OPTIONS"
                    :key="dataSharingOption.id"
                >
                    <Checkbox
                        :id="dataSharingOption.id"
                        :label="dataSharingOption.label"
                        @change="
                            (checked) => {
                                const currentDataSharingOptions =
                                    field.state.value;

                                if (checked) {
                                    // add data usage options to state
                                    field.handleChange([
                                        ...currentDataSharingOptions,
                                        dataSharingOption.value,
                                    ]);
                                } else {
                                    // remove contact method from state
                                    field.handleChange(
                                        currentDataSharingOptions.filter(
                                            (duo) =>
                                                duo !== dataSharingOption.value,
                                        ),
                                    );
                                }
                            }
                        "
                    />
                </template>
            </form.Field>

            <Separator class="my-4" />

            <!-- Digital signature / checkbox -->
            <form.Field name="legalConsent.digitalSignature" v-slot="{ field }">
                <Input
                    class="max-w-sm"
                    id="digital-signature"
                    label="Digital Signature"
                    placeholder="Signature"
                    v-bind="getTextFieldProps(field)"
                >
                    <template #subtext>
                        <p class="mb-1 ml-1 text-xs text-muted-foreground">
                            By typing your name and submitting this form, you
                            confirm that the information provided is accurate
                            and complete.
                        </p>
                        <p class="ml-1 text-xs text-muted-foreground">
                            You agree that your electronic signature has the
                            same legal effect as a handwritten signature and may
                            be relied upon by the practice for patient
                            registration and healthcare administration purposes.
                        </p>
                    </template>
                </Input>
            </form.Field>
        </div>
    </div>
</template>
