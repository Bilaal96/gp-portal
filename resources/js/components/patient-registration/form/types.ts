import {
    type usePatientRegistrationForm,
    type defaultValues,
} from '@/components/patient-registration/form/utils';

export type ContactMethod = 'phone' | 'sms' | 'email' | 'letter';

export interface TDate<T = number | null> {
    day: T;
    month: T;
    year: T;
}

/* ----------------------------- Composed types ----------------------------- */
/**
 * Used to enforce types on the Patient Registration Form's `defaultValues` tanstack form option.
 * Primitive types do not need to be listed as they can easily be inferred.
 *
 * __NOTE:__
 * (1) A field is only optional if it's explicitly suffixed with `?`.
 * (2) If a union type explicitly contains `undefined`, the corresponding field is required & its default value is `undefined`.
 * (3) For required fields, you can check for `undefined` to ensure that the user has provided input.
 */
export interface FormTypes {
    personal: {
        dateOfBirth: TDate;
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
    identity: {
        ukFirstArrivalDate: TDate;
    };
    previousMedicalRecords: {
        previousGP: {
            departureDate: TDate;
        };
        shouldRequestMedicalRecords: boolean | undefined;
        hasServedInArmedForces: boolean | undefined;
        isVeteran: boolean | undefined;
    };
    healthOverview: {
        longTermConditions: string[];
        majorIncidents: { title: string; reason: string; details: string }[];
        isUnderSpecialistCare: boolean | undefined;
        medication: { name: string; dosage: string; purpose: string }[];
        height: number;
        weight: number;
        exerciseFrequency: boolean | undefined;
        smokingHistory: string;
        alcoholConsumption: {
            frequency: string;
            quantity: string;
            bingeFrequency: string;
        };
        usesRecreationalDrugs: boolean | undefined;
    };
    equalityAndAccessibility: {
        ethnicity: string;
        otherEthnicity: string;
    };
}

export type PatientRegistrationFormValues = typeof defaultValues;

export type PatientRegistrationForm = ReturnType<
    typeof usePatientRegistrationForm
>;
