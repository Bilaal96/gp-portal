import { useLocalStorage } from '@vueuse/core';
import { inject, type InjectionKey, provide, readonly, type Ref } from 'vue';

type StepperContext = {
    stepIndex: Ref<number>;
    setStepIndex: (value: number) => void;
    next: () => void;
    prev: () => void;
};

/**
 * Symbol.for() uses key (if exists) from Global Symbol Registry (GSR), otherwise creates it.
 * This prevents browser errors after HMR caused by stale Symbol (from previous render).
 * GSR is shared across entire JS runtime - use a distinct/namespaced key to prevent potential key conflicts.
 */
const stepperInjectionKey = Symbol.for(
    'gp-portal:stepper',
) as InjectionKey<StepperContext>;

// Provider
export function provideStepper(localStorageKey: string) {
    // REVIEW: [DEV] local storage used so I don't have to keep navigating form steps
    const stepIndex = useLocalStorage(localStorageKey, 0);

    function setStepIndex(value: number) {
        stepIndex.value = value;
    }

    function next() {
        stepIndex.value++;
    }

    function prev() {
        stepIndex.value--;
    }

    const stepper = {
        stepIndex: readonly(stepIndex),
        setStepIndex,
        next,
        prev,
    };

    provide(stepperInjectionKey, stepper);

    return stepper;
}

// Consumer / Injector
export function useStepper() {
    const ctx = inject(stepperInjectionKey);
    if (!ctx) {
        throw new Error(
            '`provideStepper()` must be called in an ancestor of the injecting component.',
        );
    }
    return ctx;
}
