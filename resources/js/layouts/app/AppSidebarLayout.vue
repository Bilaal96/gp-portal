<script setup lang="ts">
import AppContent from '@/components/starter-kit/AppContent.vue';
import AppShell from '@/components/starter-kit/AppShell.vue';
import AppSidebar from '@/components/starter-kit/AppSidebar.vue';
import AppSidebarHeader from '@/components/starter-kit/AppSidebarHeader.vue';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" class="overflow-x-hidden">
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <slot />
        </AppContent>
    </AppShell>
</template>
