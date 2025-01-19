<script setup lang="ts">
defineEmits<{
  (e: 'prev' | 'next' | 'zoomIn' | 'zoomOut' | 'close'): void;
}>();

const props = defineProps<{
  current: number;
  total: number;
}>();

const hasPrev = computed(() => props.current > 1);
const hasNext = computed(() => props.current < props.total);
</script>

<template>
  <div
    class="absolute bottom-8 left-[calc(50%-100px)] flex items-center justify-center gap-x-2 rounded-xl bg-gray-300/30 px-3.5 py-1 drop-shadow-xl backdrop-blur-md dark:bg-gray-800/60"
  >
    <!-- Prev -->
    <button type="button" :disabled="!hasPrev" class="flex" @click="$emit('prev')">
      <UIcon
        name="i-charm-chevron-left"
        class="h-7 w-7"
        :class="[hasPrev ? useStyles().textColorPrimary : 'text-gray-400 dark:text-gray-700']"
      />
    </button>

    <!-- Zoom In -->
    <button type="button" class="flex" @click="$emit('zoomIn')">
      <UIcon
        name="i-heroicons-magnifying-glass-plus-20-solid"
        class="h-7 w-7"
        :class="[useStyles().textColorPrimary]"
      />
    </button>

    <!-- Zoom Out -->
    <button type="button" class="flex" @click="$emit('zoomOut')">
      <UIcon
        name="i-heroicons-magnifying-glass-minus-20-solid"
        class="h-7 w-7"
        :class="[useStyles().textColorPrimary]"
      />
    </button>

    <!-- Next -->
    <button type="button" :disabled="!hasNext" class="flex" @click="$emit('next')">
      <UIcon
        name="i-charm-chevron-right"
        class="h-7 w-7"
        :class="[hasNext ? useStyles().textColorPrimary : 'text-gray-400 dark:text-gray-700']"
      />
    </button>

    <!-- Close -->
    <button type="button" class="flex" @click="$emit('close')">
      <UIcon name="i-charm-cross" class="h-7 w-7" :class="[useStyles().textColorPrimary]" />
    </button>
  </div>
</template>
