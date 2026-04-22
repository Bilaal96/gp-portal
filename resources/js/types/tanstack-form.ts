import { type UpdateMetaOptions, useForm } from '@tanstack/vue-form';

/**
 * `TanstackField` simply defines any members of `FieldApi` that you may explicitly access on `form.field`.
 * It's essentially a simple replacement for `FieldApi` type (which is difficult to infer from).
 * Used to type `form.field` prop received by custom inputs that are tightly coupled to tanstack form - see `@/components/tanstack-form`
 */
export interface TanstackBaseField<TState = string> {
    name: string;
    state: { value: TState };
    handleChange: (value: TState) => void;
    form: {
        // Using type `any` is intentional.
        // Gets around library restrictions that cause annoying type errors that are near-impossible to resolve.
        // Here specifically, FieldApi is specific to each form instance and infers inflexible/narrow types (for field names & values) from the options provided to useForm
        getFieldValue(field: any): any;
        setFieldValue(field: any, value: any): void;
    };
}

export interface TanstackField<
    TState = string,
> extends TanstackBaseField<TState> {
    setValue(arg: any): void;
}

export interface TanstackArrayField<
    TItem = string,
    TState = TItem[],
> extends TanstackBaseField<TState> {
    pushValue(arg: any): void;
    replaceValue(index: number, arg: any): void;
    removeValue(index: number, options?: UpdateMetaOptions): void;
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
