<script setup lang="ts">
const props = defineProps<{
  name: string;
  modelValue: string;
}>();

const { value, errorMessage, handleChange, handleBlur } = useField<string>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const validationListeners = {
  blur: (e: Event) => handleBlur(e, true),
  change: handleChange,
  input: (e: Event) => handleChange(e, !!errorMessage.value),
};
</script>

<template>
  <div>
    <UInput v-model="value" type="text" v-on="validationListeners" />
    <span>{{ errorMessage }}</span>
  </div>
</template>
