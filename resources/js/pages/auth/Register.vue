<script setup lang="ts">
// import Button from '@/components/ui/button/Button.vue';

import FormWizard from '@/components/patient-registration/FormWizard.vue';
import { SidebarProvider } from '@/components/ui/sidebar';
import { provideStepper } from '@/composables/useStepper';
import RegistrationLayout from '@/layouts/RegistrationLayout.vue';

provideStepper('registration-form-step');
</script>

<template>
    <SidebarProvider>
        <RegistrationLayout>
            <FormWizard />
        </RegistrationLayout>
    </SidebarProvider>
</template>
Z
