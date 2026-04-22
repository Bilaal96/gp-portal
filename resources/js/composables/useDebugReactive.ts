import { watch } from 'vue';

export function useDebugReactive<T extends Record<string, unknown>>(
    reactiveState: T,
    label: string = 'useDebugReactive',
) {
    for (const property in reactiveState) {
        watch(
            () => reactiveState[property],
            (value) => {
                console.log(label, {
                    [property]: JSON.parse(JSON.stringify(value)),
                });
            },
            { deep: true },
        );
    }
}

export function useDebugReactiveProp<T extends Record<string, unknown>>(
    reactiveState: T,
    property: keyof T,
    label: string = 'useDebugReactiveProp:',
) {
    watch(
        () => reactiveState[property],
        (value) => {
            console.log(label, {
                [property]: JSON.parse(JSON.stringify(value)),
            });
        },
        { deep: true },
    );
}
