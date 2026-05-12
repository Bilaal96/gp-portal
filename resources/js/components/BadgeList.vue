<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { BadgeVariants } from '@/components/ui/badge';
import Badge from '@/components/ui/badge/Badge.vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    items: string[];
    variant?: BadgeVariants['variant'];
}>();
</script>

<template>
    <ul class="flex list-none flex-wrap gap-1">
        <template v-for="(item, i) in props.items" :key="i">
            <!-- `point-event-auto` allows elements passed as slot-content to trigger events - e.g. for clickable icons or buttons -->
            <Badge
                as-child
                :class="cn('[&>svg]:pointer-events-auto', props.class)"
                :variant
            >
                <li>
                    <slot name="before" :item />
                    {{ item }}
                    <slot name="after" :item />
                </li>
            </Badge>
        </template>
    </ul>
</template>
