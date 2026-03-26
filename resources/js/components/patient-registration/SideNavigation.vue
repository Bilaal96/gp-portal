<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Home } from 'lucide-vue-next';
import type { Component } from 'vue';

import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

interface Item {
    title: string;
    url: string;
    icon?: Component;
}

const items: Item[] = [
    {
        title: 'Step 1',
        url: '#',
        icon: Home,
    },
    {
        title: 'Step 2',
        url: '#',
    },
    {
        title: 'Step 3',
        url: '#',
    },
    {
        title: 'Step 4',
        url: '#',
    },
    {
        title: 'Step 5',
        url: '#',
    },
];

// Used to toggle Sidebar's collapsible prop
const breakpoints = useBreakpoints(breakpointsTailwind);
</script>

<template>
    <!-- Equivalent to: <AppSidebar /> -->
    <Sidebar
        class="overflow-hidden border md:max-h-max md:rounded md:border-muted-foreground"
        :collapsible="breakpoints.md.value ? 'none' : 'offcanvas'"
        variant="inset"
    >
        <!-- Equivalent to: <SidebarContent /> -->
        <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <!-- TODO: separate each menu item with Separator component -->
                <SidebarMenuItem
                    class="list-none"
                    v-for="(item, index) in items"
                    :key="item.title"
                >
                    <SidebarMenuButton
                        as-child
                        class="rounded px-2 py-1 hover:bg-emerald-200"
                    >
                        <a :href="item.url">
                            <component
                                v-if="item.icon !== undefined"
                                :is="item.icon"
                            />
                            <span>{{ item.title }}</span>
                        </a>
                    </SidebarMenuButton>
                    <Separator
                        v-if="index + 1 !== items.length"
                        class="my-1 bg-muted-foreground"
                    />
                </SidebarMenuItem>
            </SidebarGroupContent>
        </SidebarGroup>
    </Sidebar>
</template>
