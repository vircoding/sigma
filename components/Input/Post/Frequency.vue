<script setup lang="ts">
const model = defineModel<'daily' | 'monthly'>();

const methods = [
  { value: 'daily', label: 'Diario' },
  { value: 'monthly', label: 'Mensual' },
];
</script>

<template>
  <URadio
    v-for="method of methods"
    :key="method.value"
    v-model="model"
    v-bind="method"
    :ui="{ wrapper: 'relative flex items-center ', inner: 'ms-1.5' }"
  >
    <template #label>
      <span class="relative font-medium leading-none" :class="[useStyles().textSizeBase]">{{
        method.label
      }}</span>
    </template>
  </URadio>
</template>
