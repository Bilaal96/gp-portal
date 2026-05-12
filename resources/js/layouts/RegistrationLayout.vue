<script setup lang="ts">
import { computed } from 'vue';
import formSteps from '@/components/patient-registration/form-steps';
import Header from '@/components/patient-registration/Header.vue';
import SideNavigation from '@/components/patient-registration/SideNavigation.vue';
import { useStepper } from '@/composables/useStepper';

const { stepIndex, stepNumber } = useStepper();
const currentFormStep = computed(() => formSteps[stepIndex.value]);
</script>

<template>
    <!-- Layout Grid -->
    <div class="grid min-w-min grid-rows-[3rem_minmax(0,1fr)]">
        <!-- Header - Logo & Navigation -->
        <Header />

        <!-- FormWizard Wrapper -->
        <div
            class="grid w-full max-w-(--breakpoint-lg) justify-self-center px-2 *:mt-2 md:grid-cols-[250px_minmax(0,1fr)] md:gap-2"
        >
            <SideNavigation />

            <main class="mb-2 rounded border border-muted-foreground p-2">
                <!-- Form Step Header -->
                <div
                    class="mb-2 flex flex-wrap items-center justify-between gap-2"
                >
                    <h1 class="text-2xl font-bold">
                        {{ currentFormStep.props.title }}
                    </h1>
                    <p class="rounded bg-primary/10 px-2 py-1 font-bold">
                        Step
                        <span class="text-primary">{{ stepNumber }}</span>
                        of
                        <span class="text-primary">{{ formSteps.length }}</span>
                    </p>
                </div>

                <!-- Form Step Content -->
                <slot />
            </main>
        </div>
        <!-- End: FormWizard Wrapper end -->
    </div>
    <!-- End: Layout Grid -->
</template>
