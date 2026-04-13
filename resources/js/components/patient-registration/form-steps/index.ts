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
import Contact from '@/components/patient-registration/form-steps/Contact.vue';
// import EligibilityChecks from '@/components/patient-registration/form-steps/EligibilityChecks.vue';
import PersonalDetails from '@/components/patient-registration/form-steps/PersonalDetails.vue';

export interface FormStep {
    id: string; // iteration key: must be unique
    title: string;
    component: Component;
    props?: Record<string, unknown>;
}

// A Step can currently be accessed using the array index & `step` state
// A Map could potentially be better than an array - can be accessed by the name of the step if necessary - may also be a premature optimisation
const formSteps: FormStep[] = [
    // {
    //     id: 'eligibility',
    //     title: 'Eligibility Checks',
    //     component: EligibilityChecks,
    // },
    {
        id: 'personal-details',
        title: 'Personal Details',
        component: PersonalDetails,
    },
    {
        id: 'contact-information',
        title: 'Contact Information',
        component: Contact,
    },
];

export default formSteps;
