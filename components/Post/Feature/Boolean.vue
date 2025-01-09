<script setup lang="ts">
const props = defineProps<{
  label: string;
  state: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-y-0.5">
    <span class="font-bold" :class="[useStyles().textColorPrimary, useStyles().textSizeLG]">{{
      props.label
    }}</span>

    <aside class="flex items-center gap-x-1.5">
      <!-- Icon -->
      <div
        class="h-9 w-9"
        :class="[
          props.state ? 'text-primary-500 dark:text-primary-400' : useStyles().textColorDisabled,
        ]"
      >
        <slot name="icon" />
      </div>

      <!-- Count -->
      <!-- <span class="font-bold" :class="[useStyles().textSizeXL]">{{ props.state }}</span> -->
      <UIcon
        v-if="props.state"
        name="i-charm-tick"
        class="h-6 w-6"
        :class="[useStyles().textColorSecondary]"
      />
      <UIcon v-else name="i-charm-minus" class="h-6 w-6" :class="[useStyles().textColorDisabled]" />
    </aside>
  </div>
</template>
