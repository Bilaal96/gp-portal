<script setup lang="ts">
import AppContent from '@/components/starter-kit/AppContent.vue';
import AppHeader from '@/components/starter-kit/AppHeader.vue';
import AppShell from '@/components/starter-kit/AppShell.vue';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
</script>

<template>
    <AppShell class="flex-col">
        <AppHeader :breadcrumbs="breadcrumbs" />
        <AppContent>
            <slot />
        </AppContent>
    </AppShell>
</template>
