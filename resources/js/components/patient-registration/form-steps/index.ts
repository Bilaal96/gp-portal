/** 
 * `steps` array determines the step order & is used to iterate the steps when necessary.
 * The step component may be accessed by index
    - e.g. to render the component 

 Step Order:
 * (0) Eligibility - Eligibility & Basics (Gatekeeper step)
 * (1) Personal Details
 * (2) Address & Contact Info
 * (3) (OPTIONAL) NHS & Identity Details
 * (4) (OPTIONAL) Previous GP & Medical Records
 * (5) (OPTIONAL) Health Summary + Medications & Allergies + Lifestyle & Risk Factors
 * (6) (OPTIONAL) Equality, Accessibility & Communication Needs
 * (7) Consent, Declarations & Review
 */

import { type Component } from 'vue';
import type { PatientRegistrationForm } from '@/components/patient-registration/form/types';
import Contact from '@/components/patient-registration/form-steps/Contact.vue';
// import EligibilityChecks from '@/components/patient-registration/form-steps/EligibilityChecks.vue';
import EqualityAndAccessibility from '@/components/patient-registration/form-steps/EqualityAndAccessibility.vue';
import HealthOverview from '@/components/patient-registration/form-steps/HealthOverview.vue';
import Identity from '@/components/patient-registration/form-steps/Identity.vue';
import PersonalDetails from '@/components/patient-registration/form-steps/PersonalDetails.vue';
import PreviousMedicalRecords from '@/components/patient-registration/form-steps/PreviousMedicalRecords.vue';

export interface FormStepProps {
    form: PatientRegistrationForm;
    id: string;
    title: string;
}

export interface FormStepConfig {
    component: Component;

    // The form instance is created using a composable which must be used within a component (otherwise Vue will emit a console warning)
    props: Omit<FormStepProps, 'form'>;
}

// A Step can currently be accessed using the array index & `step` state
// A Map could potentially be better than an array - can be accessed by the name of the step if necessary - may also be a premature optimisation
const formSteps: FormStepConfig[] = [
    // {
    //     component: EligibilityChecks,
    //     id: 'eligibility',
    //     title: 'Eligibility Checks',
    // },
    {
        component: PersonalDetails,
        props: {
            id: 'personal-details',
            title: 'Personal Details',
        },
    },
    {
        component: Contact,
        props: {
            id: 'contact-information',
            title: 'Contact Information',
        },
    },
    {
        component: Identity,
        props: {
            id: 'identity',
            title: 'NHS & Identity Details',
        },
    },
    {
        component: PreviousMedicalRecords,
        props: {
            id: 'previous-medical-records',
            title: 'Previous Medical Records',
        },
    },
    {
        component: HealthOverview,
        props: {
            id: 'health-overview',
            title: 'Health Overview',
        },
    },
    {
        component: EqualityAndAccessibility,
        props: {
            id: 'equality-and-accessibility',
            title: 'Equality, Accessibility & Communication Needs',
        },
    },
];

export default formSteps;
