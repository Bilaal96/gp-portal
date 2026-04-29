import type { TanstackField } from '@/types';

export function getTextFieldProps(field: TanstackField) {
    return {
        name: field.name,
        value: field.state.value,
        onInput: (e: Event) =>
            field.handleChange((e.target as HTMLInputElement).value),
    };
}

export function getNumberFieldProps(field: TanstackField<number>) {
    return {
        name: field.name,
        value: field.state.value,
        onInput: (e: Event) =>
            field.handleChange((e.target as HTMLInputElement).valueAsNumber),
    };
}
