// Used to enforce types on the Patient Registration Form's `defaultValues` tanstack form option.
import {
    type usePatientRegistrationForm,
    type defaultValues,
} from '@/components/patient-registration/form/utils';

/* --------------------------------- General -------------------------------- */
export type PatientRegistrationFormValues = typeof defaultValues;

export type PatientRegistrationForm = ReturnType<
    typeof usePatientRegistrationForm
>;

/** Required boolean field - validate by checking field value is NOT null */
export type BooleanField = boolean | null;
/** Optional boolean field - undefined values are permissible as they are omitted from tanstack form state on submission */
export type OptionalBooleanField = boolean | undefined;

export interface TDate<T = number | null> {
    day: T;
    month: T;
    year: T;
}

/* ------------------------------ Step-specific ----------------------------- */
// 1. Personal Details
export type GenderIdentity =
    | 'male'
    | 'female'
    | 'non-binary'
    | 'other'
    | 'undisclosed';

export type SexAtBirth = 'male' | 'female' | 'undisclosed';

// 2. Contact
export type ContactMethod = 'phone' | 'sms' | 'email' | 'letter';

// 3. Identity

// 4. Previous Medical Records

// 5. Health Overview
export interface MajorIncident {
    title: string;
    reason: string;
    details: string;
}

export interface Medication {
    name: string;
    dosage: string;
    purpose: string;
}

// 6. Equality And Accessibility

// 7. Declaration of Legal Consent
export type DataSharingOption = 'Direct Care' | 'NHS Planning';
