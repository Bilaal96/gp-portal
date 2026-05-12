import { watch } from 'vue';

/**
 * Tanstack Form types cannot be inferred without direct access to the instance.
 * The type only needs to describe what is accessed by the composable.
 */
interface TanstackForm {
    useStore: (arg: any) => any;
}

/**
 * Reactive state logging for debugging tanstack form inputs.
 * This function is necessary because Tanstack Form manages its own state & is non-reactive.
 * As a result, we must:
    1. leverage the `form.useStore` method to manually subscribe to changes in the Tanstack form state;
    2. watch its return value for changes;
    3. log the form, or form step (in a multi-step form).

 * @param form - a tanstack form instance returned via `useForm` hook
 * @param options.formStep - the name of a field passed to `useForm`'s `defaultValues` option
 * @param options.label - identifies the log
 */
export function useDebugForm(
    form: TanstackForm,
    options: {
        // debug a given step in a multi-step form
        // -- should match the name of a field passed to useForm's defaultValues option
        formStep?: string;

        // identifies the log
        label?: string;
    } = {},
) {
    // Set default options
    if (!options.label) {
        options.label = 'useDebugStore';
    }

    const { formStep, label } = options;

    // Subscribe to changes in tanstack form state
    const watchValue = form.useStore((state: any) => {
        if (formStep) return state.values[formStep];
        return state.values;
    });

    // Log form state when changes occur
    watch(watchValue, (state) =>
        console.log(label + ':', JSON.parse(JSON.stringify(state))),
    );
}
