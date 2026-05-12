<script setup lang="ts">
import { Menu } from 'lucide-vue-next';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';

const { isMobile } = useSidebar();
</script>

<template>
    <div class="bg-primary">
        <div
            class="mx-auto flex h-full w-full max-w-(--breakpoint-lg) items-center justify-between p-2"
        >
            <!-- Sidebar trigger & Logo -->
            <div class="flex gap-2">
                <!-- Equivalent to: 
                    <Menu
                        v-if="isMobile"
                        role="toggle"
                        class="transition-colors hover:cursor-pointer hover:text-zinc-400"
                        @click="toggleSidebar"
                    /> 
                -->
                <SidebarTrigger
                    v-if="isMobile"
                    :icon="Menu"
                    class="transition-colors hover:cursor-pointer"
                />

                <h1 class="font-bold text-primary-foreground">👨‍⚕️ GP Portal</h1>
            </div>

            <button
                class="rounded border-none bg-foreground px-2 py-1 text-secondary-foreground transition-colors hover:cursor-pointer hover:bg-foreground/75"
            >
                Login
            </button>
        </div>
    </div>
</template>
