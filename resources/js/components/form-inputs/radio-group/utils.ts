import RadioGroupOption from '@/components/form-inputs/radio-group/RadioGroupOption';
import type { TanstackField } from '@/types';

/**
 * Convenience helper used to generate values for `options` prop of `/js/components/form-inputs/RadioGroup.vue`.
 */

// ? Are these types shared with RadioGroupOption class? can they be reused?
export type RadioGroupOptionLiteral = {
    id: string;
    label: string;
    value: string;
};
type RadioGroupOptionInput = string | RadioGroupOptionLiteral;

function toRadioGroupOption(input: RadioGroupOptionInput) {
    if (typeof input === 'string') {
        return new RadioGroupOption(input);
    }

    return new RadioGroupOption(input.id, input.label, input.value);
}

export function createRadioGroupOptions(
    options: RadioGroupOptionInput[],
): RadioGroupOption[] {
    return options.map(toRadioGroupOption);
}

type BinaryRadioGroupInputs = [RadioGroupOptionInput, RadioGroupOptionInput];
type BinaryRadioGroupOptions = [RadioGroupOption, RadioGroupOption];

export function binaryRadioGroup(
    options?: BinaryRadioGroupInputs,
): [RadioGroupOption, RadioGroupOption] {
    if (!options) {
        return createRadioGroupOptions([
            'yes',
            'no',
        ]) as BinaryRadioGroupOptions;
    }

    return createRadioGroupOptions(options) as BinaryRadioGroupOptions;
}

/**
 * Determine default value for basic binary (yes/no) RadioGroup form input & preserve default value on navigation.
 * This is particularly important for RadioGroup values that are used to show/hide conditional fields, as it ensures that they're correctly shown/hidden.
 */
export function getBinaryRadioGroupDefaultValue(
    field: TanstackField<boolean | undefined>,
) {
    // An option has not been selected
    if (field.state.value === undefined) return '';
    // 'Yes' option has been selected
    if (field.state.value) return 'yes';
    // 'No' option has been selected
    return 'no';
}
