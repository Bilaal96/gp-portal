import { useForm } from '@tanstack/vue-form';

export interface DateOfBirth<T = number | null> {
    day: T;
    month: T;
    year: T;
}

interface FormTypes {
    dateOfBirth: DateOfBirth;
    sexAtBirth: 'male' | 'female' | 'undisclosed';
    isPregnant?: boolean;
    genderIdentity: 'male' | 'female' | 'non-binary' | 'other' | 'undisclosed';
}

// ? If a value is marked as dependency: the preceding input value determines if it renders or not.
export const defaultValues = {
    proxyRegistrationGuard: {
        // TODO: proxy-registration
        // radio: yourself | (2) child | (3) someone you care for
        // ! Affects conditional rendering of subsequent form inputs
        applyingFor: '',
        // ? dependency
        // -- Answer 2 or 3: Are you already a patient registered with this practice?
        // false: not eligible - must be existing patient to apply on behalf of someone else
        // true: request user login before proceeding to proxy-registration form (should have additional step to verify identity)
        existingPatient: false,
    },
    personal: {
        firstName: '',
        middleNames: '', // optional
        lastName: '',
        previousNames: '', // optional

        // date of birth - custom input
        dateOfBirth: {
            day: null,
            month: null,
            year: null,
        } as FormTypes['dateOfBirth'],

        // radio
        sexAtBirth: '' as FormTypes['sexAtBirth'],
        // ? dependency
        // radio: // yes | no
        isPregnant: undefined as FormTypes['isPregnant'],

        // radio - (include "prefer not to say" option)
        genderIdentity: '' as FormTypes['genderIdentity'],
        // input:text - user may specify another gender identity
        genderIdentityOther: '',

        // Optional, radio: yes / no | true / false
        ukResidencyConfirmation: false,
        // checkbox
        acknowledgedApplicationProcessDuration: false,
    },
};

// Form factory - required to extract type of useForm instance
export function createPatientRegistrationForm() {
    return useForm({ defaultValues });
}

// Derived types
export type PatientRegistrationFormValues = typeof defaultValues;

export type PatientRegistrationForm = ReturnType<
    typeof createPatientRegistrationForm
>;
