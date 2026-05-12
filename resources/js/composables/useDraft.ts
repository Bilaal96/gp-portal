import { ref, watch } from 'vue';

/** 
 * Form state
 * -- add draft to form state
 * -- edit form state - depends on draft state's editIndex
 * -- remove from form state - depends on draft state's editIndex
 
 * Draft hook - determine when to show/hide draft view
 * -- Show the edit view (i.e. set edit mode)
 * -- clear edit view fields
 * -- reset edit view (i.e. exit edit mode) 
    -- clear & hide fields
    -- reset editIndex to null
 
 * TODO extend to support validation & UI feedback (e.g. error messages)
 
 * Use `options` object as second argument
    - expose an `isValid()` function
    - add `validator` option -> a callback function that is called when draft.isValid() is called

 * OR expose a validate() fn that accepts a callback as argument
    - the callback has access to the draft state
    - this allows you to define a custom validator wherever you call it
 */
export default function useDraft<TState extends Record<string, string>>(
    draftState: TState,
    debugLabel?: string | undefined,
) {
    const editIndex = ref<number | null>(null);
    const draft = ref<TState>({ ...draftState });
    const showDraftFields = ref(false);

    if (debugLabel) {
        watch(draft.value, (draft) => {
            console.log(
                debugLabel + ' [draft]',
                JSON.parse(JSON.stringify(draft)),
            );
        });
    }

    /**
     * Determine if the draft is in edit mode.
     *
     * **NOTE:** An `index` argument must be provided when trying to narrow `editIndex.value` from `number | null` to `number`.
     * Without the `index` argument, it will simply return a `boolean`.
     */
    function isEditing(index = editIndex.value): index is number {
        return index !== null;
    }

    function showEditView(newEditIndex: number, valuesToEdit: TState) {
        editIndex.value = newEditIndex;

        // Populate draft state with valuesToEdit
        for (const fieldName in draft.value) {
            draft.value[fieldName] = valuesToEdit[fieldName];
        }

        showDraftFields.value = true;

        // Focus the first draft input within the component - that logic doesn't belong here
    }

    function clearDraftFields() {
        for (const fieldName in draft.value) {
            draft.value[fieldName] = '';
        }
    }

    function resetDraftFields() {
        clearDraftFields();
        showDraftFields.value = false;

        if (isEditing()) editIndex.value = null;
    }

    return {
        editIndex,
        draft,
        showDraftFields,
        isEditing,

        // main functionality composed of the above
        showEditView,
        clearDraftFields,
        resetDraftFields,
    };
}
