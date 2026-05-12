import RadioGroupOption from '@/components/form-inputs/radio-group/RadioGroupOption';

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
