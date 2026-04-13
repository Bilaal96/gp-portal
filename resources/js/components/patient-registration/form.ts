import { useForm } from '@tanstack/vue-form';

export interface DateOfBirth<T = number | null> {
    day: T;
    month: T;
    year: T;
}

export type ContactMethod = 'phone' | 'sms' | 'email' | 'letter';

/**
 * NOTE: if a union type explicitly contains `undefined`, the corresponding field is required & its default value is `undefined`.
 * For required fields, you can check for `undefined` to ensure that the user has provided input.
 */
interface FormTypes {
    personal: {
        dateOfBirth: DateOfBirth;
        sexAtBirth: 'male' | 'female' | 'undisclosed';
        isPregnant?: boolean;
        genderIdentity:
            | 'male'
            | 'female'
            | 'non-binary'
            | 'other'
            | 'undisclosed';
        meetsUkResidencyDuration: boolean | undefined;
    };
    contact: {
        hasFixedAddress: boolean | undefined;
        preferredContactMethods: ContactMethod[];
    };
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

        accountEmail: '',

        // date of birth - custom input
        dateOfBirth: {
            day: null,
            month: null,
            year: null,
        } as FormTypes['personal']['dateOfBirth'],

        // radio - (include "prefer not to say" option)
        sexAtBirth: '' as FormTypes['personal']['sexAtBirth'],
        // ? dependency: input shown if sexAtBirth === 'female'
        // radio: boolean | undefined (unanswered)
        isPregnant: undefined as FormTypes['personal']['isPregnant'],

        // radio - (include "prefer not to say" option)
        genderIdentity: '' as FormTypes['personal']['genderIdentity'],
        // ? dependency: input shown if genderIdentity === 'other'
        // input:text - user may specify another gender identity
        genderIdentityOther: '',

        // Optional, radio: boolean | undefined (unanswered)
        meetsUkResidencyDuration:
            undefined as FormTypes['personal']['meetsUkResidencyDuration'],

        // checkbox
        acknowledgedApplicationProcessDuration: false,
    },
    contact: {
        hasFixedAddress: undefined as FormTypes['contact']['hasFixedAddress'],
        address1: '',
        address2: '',
        city: '',
        postCode: '',
        primaryPhone: '',
        secondaryPhone: '',
        email: '',
        preferredContactMethods:
            [] as FormTypes['contact']['preferredContactMethods'],
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
