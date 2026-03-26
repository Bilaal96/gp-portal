<script setup lang="ts">
import Header from '@/components/patient-registration/Header.vue';
import SideNavigation from '@/components/patient-registration/SideNavigation.vue';
</script>

<template>
    <!-- Layout Grid -->
    <div
        class="grid h-screen grid-rows-[3rem_minmax(0,1fr)] bg-background text-foreground"
    >
        <!-- Header - Logo & Navigation -->
        <Header />

        <!-- FormWizard Wrapper -->
        <div
            class="grid w-full max-w-(--breakpoint-lg) justify-self-center px-2 *:mt-2 md:grid-cols-[250px_minmax(0,1fr)] md:gap-2"
        >
            <SideNavigation />

            <main class="mb-2 rounded border border-muted-foreground p-2">
                <slot />
            </main>
        </div>
        <!-- End: FormWizard Wrapper end -->
    </div>
    <!-- End: Layout Grid -->
</template>
