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

import { defineComponent, h, ref, type Component } from 'vue';
import PersonalDetails from './PersonalDetails.vue';
// import EligibilityChecks from './EligibilityChecks.vue';

export interface FormStep {
    id: string; // iteration key: must be unique
    title: string;
    component: Component;
    props?: Record<string, unknown>;
}

const PlaceholderStep = defineComponent({
    name: 'PlaceholderStep',
    setup() {
        const count = ref(0);
        const increment = () => count.value++;

        return () =>
            h('div', { class: 'container' }, [
                h('p', `Count is: ${count.value}`),
                h('button', { onClick: increment }, 'Increment'),
            ]);
    },
});

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
        id: 'placeholder',
        title: 'Placeholder',
        component: PlaceholderStep,
    },
];

export default formSteps;
