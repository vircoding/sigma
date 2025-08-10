<script setup lang="ts">
const props = defineProps<{
  name: string;
  modelValue: Frequency;
}>();

const { value } = useField<Frequency>(() => props.name, undefined, {
  syncVModel: true,
});

const methods = [
  { value: 'daily', label: 'Diario' },
  { value: 'monthly', label: 'Mensual' },
];
</script>

<template>
  <URadio
    v-for="method of methods"
    :key="method.value"
    v-model="value"
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
