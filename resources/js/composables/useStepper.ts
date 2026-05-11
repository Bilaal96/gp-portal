import { useLocalStorage } from '@vueuse/core';
import { inject, type InjectionKey, provide, readonly, type Ref } from 'vue';

type StepperContext = {
    stepIndex: Ref<number>;
    setStepIndex: (value: number) => void;
    next: () => void;
    prev: () => void;
};

const stepperInjectionKey = Symbol('stepper') as InjectionKey<StepperContext>;

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
