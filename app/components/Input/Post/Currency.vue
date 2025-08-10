<script setup lang="ts">
const props = defineProps<{
  name: string;
  modelValue: Currency;
}>();

const { value } = useField<Currency>(() => props.name, undefined, {
  syncVModel: true,
});

const methods = [
  { value: 'USD', label: 'USD' },
  { value: 'CUP', label: 'CUP' },
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
