import { useForm } from '@tanstack/vue-form';
import type { FormTypes } from '@/components/patient-registration/form/types';

const DEFAULT_DATE = {
    day: null,
    month: null,
    year: null,
};

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
            ...DEFAULT_DATE,
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
    identity: {
        nhsNumber: '',
        nationalInsuranceNumber: '',

        countryOfBirth: '',
        // ? dependency: render if country of birth is not UK
        ukFirstArrivalDate: {
            ...DEFAULT_DATE,
        } as FormTypes['identity']['ukFirstArrivalDate'],
    },
    previousMedicalRecords: {
        previousGP: {
            name: '',
            address1: '',
            address2: '',
            city: '',
            postCode: '',
            departureDate: {
                ...DEFAULT_DATE,
            } as FormTypes['previousMedicalRecords']['previousGP']['departureDate'],
        },
        shouldRequestMedicalRecords:
            undefined as FormTypes['previousMedicalRecords']['shouldRequestMedicalRecords'],
        hasServedInArmedForces:
            undefined as FormTypes['previousMedicalRecords']['hasServedInArmedForces'],
        isVeteran:
            undefined as FormTypes['previousMedicalRecords']['isVeteran'],
    },
    healthOverview: {
        longTermConditions:
            [] as FormTypes['healthOverview']['longTermConditions'],
        majorIncidents: [
            { title: 'test', reason: 'test', details: 'test' },
        ] as FormTypes['healthOverview']['majorIncidents'],
        isUnderSpecialistCare: undefined,
    },
};

// Form factory - required to extract type of useForm instance
// Must be called within a component's setup() function or SFC (because it is a composable)
export function usePatientRegistrationForm(
    formOptions: Record<string, unknown> = {},
) {
    return useForm({ defaultValues, ...formOptions });
}
