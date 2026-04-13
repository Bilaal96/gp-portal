<script setup lang="ts">
import { watch } from 'vue';
import Checkbox from '@/components/form-inputs/Checkbox.vue';
import Input from '@/components/form-inputs/Input.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import { getTextFieldProps } from '@/components/form-inputs/utils';
import type {
    ContactMethod,
    PatientRegistrationForm,
} from '@/components/patient-registration/form';
import { Separator } from '@/components/ui/separator';
import { capitalize } from '@/lib/utils';

const props = defineProps<{
    form: PatientRegistrationForm;
}>();

const contactMethods: ContactMethod[] = ['phone', 'sms', 'email', 'letter'];

const hasFixedAddress = props.form.useStore(
    (state) => state.values.contact.hasFixedAddress,
);

// REVIEW: validate fields on submit instead of clearing then when hasFixedAddress is false
watch(hasFixedAddress, (state) => {
    if (!state) {
        props.form.setFieldValue('contact.address1', '');
        props.form.setFieldValue('contact.address2', '');
        props.form.setFieldValue('contact.city', '');
        props.form.setFieldValue('contact.postCode', '');
    }
});

// [DEBUG] Reactive state logging for debugging tanstack form input syncing
const contact = props.form.useStore((state) => state.values.contact);
watch(contact, (state) =>
    console.log('Contact Info', JSON.parse(JSON.stringify(state))),
);
</script>

<template>
    <div>
        <h1 class="mb-2 text-2xl font-bold">Address & Contact Info</h1>

        <p class="mb-4">
            Please provide your contact information so we can get in touch with
            you regarding appointments & health concerns.
        </p>

        <div class="space-y-4">
            <!-- Address -->
            <!-- No fixed address - checkbox 
            * legal requirement for the homeless - cannot refuse registration if applicant does not have fixed address

            * unchecked (default) - shows Fixed Address inputs (see below)
            * checked 
                - hides fixed address input
                - use clinic address as temporary address
        -->
            <form.Field name="contact.hasFixedAddress" v-slot="{ field }">
                <RadioGroup
                    id="has-fixed-address"
                    prompt="Do you have a fixed address?"
                    subtext="If you're homeless we will use our clinic as a temporary address. You can change this at any time by getting in touch with us."
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <!-- Fixed address fields - input:text -->
            <div v-if="hasFixedAddress" id="address-fields" class="space-y-2">
                <p class="mb-2 ml-1 text-sm font-bold">
                    Please enter your address:
                </p>
                <!-- First line -->
                <form.Field name="contact.address1" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 1"
                        id="address-line-1"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Second line (optional) -->
                <form.Field name="contact.address2" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        placeholder="Address Line 2"
                        id="address-line-2"
                        v-bind="getTextFieldProps(field)"
                    />
                </form.Field>

                <!-- City -->
                <form.Field name="contact.city" v-slot="{ field }">
                    <Input
                        class="max-w-sm"
                        placeholder="City"
                        id="address-city"
                        v-bind="getTextFieldProps(field)"
                        required
                    />
                </form.Field>

                <!-- Post Code -->
                <form.Field name="contact.postCode" v-slot="{ field }">
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
                                const preferredContactMethods =
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
