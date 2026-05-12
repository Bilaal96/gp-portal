<script setup lang="ts">
import { watch } from 'vue';
import Checkbox from '@/components/form-inputs/Checkbox.vue';
import Input from '@/components/form-inputs/Input.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type { ContactMethod } from '@/components/patient-registration/form/types';
import { type FormStepProps } from '@/components/patient-registration/form-steps';
import { Separator } from '@/components/ui/separator';
import { useDebugForm } from '@/composables/useDebugForm';
import { capitalize } from '@/lib/utils';

const props = defineProps<FormStepProps>();

const contactMethods: ContactMethod[] = ['phone', 'sms', 'email', 'letter'];

const hasFixedAddress = props.form.useStore(
    (state) => state.values.contact.hasFixedAddress,
);

// REVIEW: validate fields on submit instead of clearing then when hasFixedAddress is false
watch(hasFixedAddress, (state) => {
    switch (state) {
        case false:
            // No fixed address - set to clinic's address
            props.form.setFieldValue('contact.address1', '121 Withington Rd');
            props.form.setFieldValue('contact.address2', 'Whalley Range');
            props.form.setFieldValue('contact.city', 'Manchester');
            props.form.setFieldValue('contact.postCode', 'M16 8EE');
            break;
        case true:
        case null:
            // Ensure fields are emptied before user provides input
            props.form.resetField('contact.address1');
            props.form.resetField('contact.address2');
            props.form.resetField('contact.city');
            props.form.resetField('contact.postCode');
            break;
    }
});

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
useDebugForm(props.form, { formStep: 'contact', label: props.title });
</script>

<template>
    <div :id="props.id">
        <p class="mb-4">
            Please provide your contact information so we can get in touch with
            you regarding appointments & health concerns.
        </p>

        <div class="space-y-4">
            <!-- Address -->
            <!-- RadioGroup (binary) - No fixed address 
                * legal requirement for the homeless - cannot refuse registration if applicant does not have fixed address

                * yes 
                    - show Fixed Address inputs (see below)
                * no 
                    - hides Fixed Address inputs
                    - use clinic address as temporary address
            -->
            <form.Field name="contact.hasFixedAddress" v-slot="{ field }">
                <RadioGroup
                    id="has-fixed-address"
                    prompt="Do you have a fixed address?"
                    :options="binaryRadioGroup()"
                    @change="
                        (value) => {
                            field.handleChange(value === 'yes' ? true : false);
                        }
                    "
                >
                    <template #subtext>
                        <p class="text-muted-foreground">
                            If you're homeless we will use our clinic as a
                            temporary address. You can change this at any time
                            by getting in touch with us.
                        </p>
                    </template>
                </RadioGroup>
            </form.Field>

            <!-- Fixed address fields - input:text -->
            <div v-if="hasFixedAddress" id="address-fields" class="space-y-2">
                <p class="mb-2 ml-1 text-sm font-bold">
                    Please enter your address:
                </p>
                <!-- First line -->
                <form.Field
                    name="contact.address1"
                    v-slot="{ field }"
                    :preserve-value="true"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 1"
                        id="address-line-1"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Second line (optional) -->
                <form.Field
                    name="contact.address2"
                    v-slot="{ field }"
                    :preserve-value="true"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 2"
                        id="address-line-2"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>

                <!-- City -->
                <form.Field
                    name="contact.city"
                    v-slot="{ field }"
                    :preserve-value="true"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="City"
                        id="address-city"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Post Code -->
                <form.Field
                    name="contact.postCode"
                    v-slot="{ field }"
                    :preserve-value="true"
                >
                    <Input
                        class="max-w-sm"
                        placeholder="Post Code"
                        id="address-post-code"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>
            </div>

            <Separator class="my-4" />

            <!-- Phone - input:text with inputmode=numeric & pattern=[0-9*] -->
            <form.Field name="contact.primaryPhone" v-slot="{ field }">
                <Input
                    id="primary-phone"
                    class="max-w-sm"
                    label="Phone Number"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="tel"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>

            <!-- Phone landline - (optional) - input:text with inputmode=numeric & pattern=[0-9*] -->
            <form.Field name="contact.secondaryPhone" v-slot="{ field }">
                <Input
                    id="secondary-phone"
                    class="max-w-sm"
                    label="Phone Number (Secondary)"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="tel"
                    v-bind="getTextFieldProps(field)"
                />
            </form.Field>

            <!-- Contact email input:email 
                * may be different to account registration email 
                * REVIEW: 
                * use personal.accountEmail as contact.email   
                    - either prompt to leave blank - if empty fallback to personal.accountEmail
                    - [preferred] use checkbox to signal use of persona.accountEmail
            -->
            <form.Field name="contact.email" v-slot="{ field }">
                <Input
                    id="email"
                    class="max-w-sm"
                    type="email"
                    label="Email"
                    v-bind="getTextFieldProps(field)"
                    required
                />
            </form.Field>

            <!-- Preferred contact method - checkbox group - options:
                * Phone
                * SMS
                * Email
                * Letter
            -->
            <form.Field
                name="contact.preferredContactMethods"
                v-slot="{ field }"
            >
                <!-- REVIEW: 
                - could extract to CheckboxGroup 
                - include prompt & option to render multiple checkboxes (akin to form-inputs/RadioGroup.vue) 
            -->
                <p class="mb-2 ml-1 text-sm font-bold">
                    Select your preferred contact method(s):
                </p>
                <template v-for="method in contactMethods" :key="method">
                    <Checkbox
                        :id="method"
                        :label="
                            method === 'sms'
                                ? method.toLocaleUpperCase()
                                : capitalize(method)
                        "
                        @change="
                            (checked) => {
                                const preferredContactMethods: ContactMethod[] =
                                    field.state.value;

                                if (checked) {
                                    // add contact method to state
                                    field.handleChange([
                                        ...preferredContactMethods,
                                        method,
                                    ]);
                                } else {
                                    // remove contact method from state
                                    field.handleChange(
                                        preferredContactMethods.filter(
                                            (pcm) => pcm !== method,
                                        ),
                                    );
                                }
                            }
                        "
                    />
                </template>
            </form.Field>
        </div>
    </div>
</template>
