import { useForm } from '@tanstack/vue-form';

/**
 * Used to type form.field prop received by tanstack-form/Input.vue
 * The component just needs to be aware of explicitly used members.
 */
export interface FieldProps {
    name: string;
    state: { value: string | number };
    handleChange: (value: string) => void;
}

/* --------------------------------- Unused --------------------------------- */
/**
 * Experiment to see if we could make a generic form factory.
 * Decided against it as it loses inference - everything becomes unknown.
 */
export function createForm<TOptions extends Parameters<typeof useForm>[0]>(
    options: TOptions,
) {
    return useForm(options);
}

export type TanstackForm = ReturnType<typeof createForm>;
