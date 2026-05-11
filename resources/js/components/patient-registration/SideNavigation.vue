<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import formSteps from '@/components/patient-registration/form-steps';

import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useStepper } from '@/composables/useStepper';
import { cn } from '@/lib/utils';

const stepper = useStepper();
const sidebar = useSidebar();

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
            <SidebarGroupLabel>Patient Registration Steps</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenuItem
                    class="list-none"
                    v-for="(stepComponent, index) in formSteps"
                    :key="stepComponent.props.title"
                >
                    <SidebarMenuButton
                        :class="
                            cn(
                                'h-max cursor-pointer rounded px-2 py-2 transition-all',
                                // hover state
                                'hover:border-l-4 hover:border-primary/40 hover:bg-primary/20',
                                {
                                    // current step
                                    'border-l-4 border-primary bg-primary/50':
                                        index === stepper.stepIndex.value,
                                },
                            )
                        "
                        @click="
                            () => {
                                stepper.setStepIndex(index);
                                sidebar.setOpenMobile(false);
                            }
                        "
                    >
                        {{ index + 1 + '. ' + stepComponent.props.title }}
                    </SidebarMenuButton>
                    <Separator
                        v-if="index + 1 !== formSteps.length"
                        class="my-1 bg-muted-foreground"
                    />
                </SidebarMenuItem>
            </SidebarGroupContent>
        </SidebarGroup>
    </Sidebar>
</template>
