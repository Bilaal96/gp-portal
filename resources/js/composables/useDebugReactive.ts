import { watchEffect } from 'vue';

export function useDebugReactive<T extends Record<string, unknown>>(
    reactiveState: T,
    label: string = 'useDebugReactive',
) {
    watchEffect(
        () => {
            // `JSON.stringify` deeply accesses every property in the reactive object, causing Vue to track all of them as dependencies
            JSON.stringify(reactiveState);
        },
        {
            // `key` refers to the property accessed on/within `reactiveState`
            // Do not confuse this with the key code that triggers an event
            // Only active in dev environment - no-op in production
            onTrigger(e) {
                console.log(label, { [e.key as string]: e.newValue });
            },
        },
    );
}
