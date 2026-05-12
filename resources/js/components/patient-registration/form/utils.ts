import { useForm } from '@tanstack/vue-form';
import type {
    BooleanField,
    ContactMethod,
    DataSharingOption,
    GenderIdentity,
    MajorIncident,
    Medication,
    OptionalBooleanField,
    SexAtBirth,
    TDate,
} from '@/components/patient-registration/form/types';

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
        middleNames: '', // [optional]
        lastName: '',
        previousNames: '', // [optional]
        accountEmail: '',

        // custom input: form-inputs/DateInput.vue
        dateOfBirth: { ...DEFAULT_DATE } as TDate,

        // radio - (include "prefer not to say" option)
        genderIdentity: '' as GenderIdentity,
        // ? conditionally rendered when: genderIdentity === 'other'
        // input:text - user may specify another gender identity
        genderIdentityOther: '',

        // radio - (include "prefer not to say" option)
        sexAtBirth: '' as SexAtBirth,
        // ? conditionally rendered when: sexAtBirth === 'female'
        // [optional] radio
        isPregnant: undefined as OptionalBooleanField,

        // [optional] radio (binary)
        meetsUkResidencyDuration: undefined as OptionalBooleanField,

        // Required to check the checkbox to proceed
        acknowledgedApplicationProcessDuration: false,
    },
    contact: {
        hasFixedAddress: null as BooleanField,
        address1: '',
        address2: '',
        city: '',
        postCode: '',
        primaryPhone: '',
        secondaryPhone: '',
        email: '',
        preferredContactMethods: [] as ContactMethod[],
    },
    identity: {
        nhsNumber: '',
        nationalInsuranceNumber: '',

        countryOfBirth: '',
        // ? conditionally rendered when: country of birth is not UK
        ukFirstArrivalDate: {
            ...DEFAULT_DATE,
        } as TDate,
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
            } as TDate,
        },
        shouldRequestMedicalRecords: undefined as OptionalBooleanField,
        hasServedInArmedForces: undefined as OptionalBooleanField,
        isVeteran: undefined as OptionalBooleanField,
    },
    healthOverview: {
        longTermConditions: [] as string[],
        majorIncidents: [] as MajorIncident[],
        isUnderSpecialistCare: undefined as OptionalBooleanField,
        medication: [] as Medication[],
        height: 0,
        weight: 0,
        exerciseFrequency: '',
        smokingHistory: '',
        alcoholConsumption: {
            frequency: '',
            quantity: '',
            bingeFrequency: '',
        },
        usesRecreationalDrugs: undefined as OptionalBooleanField,
    },
    equalityAndAccessibility: {
        ethnicity: '',
        religiousBackground: '',

        requiresAidAndSupport: null as BooleanField,
        requiredAidAndSupport: [] as string[],

        preferredLanguage: '',
        requiresInterpreter: undefined as OptionalBooleanField,
    },
    legalConsent: {
        canContactViaSmsOrEmail: null as BooleanField,
        dataSharing: [] as DataSharingOption[],
        digitalSignature: '',
    },
};

// Form factory - required to extract type of useForm instance
// Must be called within a component's setup() function or SFC (because it is a composable)
export function usePatientRegistrationForm(
    formOptions: Record<string, unknown> = {},
) {
    return useForm({ defaultValues, ...formOptions });
}
