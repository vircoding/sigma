<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
}>();

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <UCheckbox v-model="model" :name="props.name" class="mb-4" :ui="useUIConfigs().checkboxConfig">
    <template #label>
      <span class="relative font-medium leading-none" :class="[useStyles().textSizeBase]">{{
        props.label
      }}</span>
    </template>
  </UCheckbox>
</template>
