<script setup lang="ts">
import type { FunctionalComponent, HTMLAttributes } from "vue"
import { LucideProps, PanelLeft } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

type LucideIcon = FunctionalComponent<LucideProps, {}, any, {}>

const props = defineProps<{
  class?: HTMLAttributes["class"],
  icon?: LucideIcon
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft v-if="props.icon === undefined" />
    <component v-else-if="props.icon" :is="props.icon"  />

    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
