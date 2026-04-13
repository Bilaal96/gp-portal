<script setup lang="ts">
import { watch } from 'vue';
import Checkbox from '@/components/form-inputs/Checkbox.vue';
import RadioGroup from '@/components/form-inputs/radio-group/RadioGroup.vue';
import { binaryRadioGroup } from '@/components/form-inputs/radio-group/utils';
import type {
    ContactMethod,
    PatientRegistrationForm,
} from '@/components/patient-registration/form';
import { capitalize } from '@/lib/utils';

const props = defineProps<{
    form: PatientRegistrationForm;
}>();

const contactMethods: ContactMethod[] = ['phone', 'sms', 'email', 'letter'];

const hasFixedAddress = props.form.useStore(
    (state) => state.values.contact.hasFixedAddress,
);

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
                    prompt="Do you have a fixed address? If you're homeless we will use our clinic as a temporary address. You can change this at any time by getting in touch with us."
                    :options="binaryRadioGroup()"
                    @change="
                        (value) =>
                            field.handleChange(value === 'yes' ? true : false)
                    "
                />
            </form.Field>

            <!-- Fixed address fields - input:text -->
            <div v-if="hasFixedAddress" id="address-fields">
                <!-- First line -->
                <!-- Second line (optional) -->
                <!-- City -->
                <!-- Post Code -->
                Test
            </div>

            <!-- Phone - input:text with inputmode=numeric & pattern=[0-9*] -->
            <!-- Phone landline - (optional) - input:text with inputmode=numeric & pattern=[0-9*] -->

            <!-- Contact email input:email 
            * may be different to account registration email 
            * REVIEW: 
            * use personal.accountEmail as contact.email   
                - either prompt to leave blank - if empty fallback to personal.accountEmail
                - [preferred] use checkbox to signal use of persona.accountEmail
        -->

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
