<script setup lang="ts">
import { z, ZodError } from 'zod';

const model = defineModel<string>({ required: true });

const schema = z
  .number({ message: 'Debe ser una tarifa válida' })
  .int('Debe ser una tarifa válida')
  .gte(1, 'Debe ser una tarifa válida')
  .lte(999999999, 'Debe ser una tarifa válida');

const errors = computed<{
  error: boolean;
  message?: string;
}>(() => {
  try {
    schema.parse(Number(model.value));

    return { error: false };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((issue) => issue.message);

      return { error: messages.length !== 0, message: messages[0] || '' };
    }

    return { error: true };
  }
});

const backendError = ref(false);
const errorVisibility = ref(false);

defineExpose<{
  setBackendError: () => void;
  setErrorVisibility: () => void;
}>({
  setBackendError: function () {
    backendError.value = true;
  },

  setErrorVisibility: function () {
    errorVisibility.value = true;
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Tarifa"
    name="tax"
    :error="
      (backendError && 'Debe ser una tarifa válida') ||
      (errors.error && errorVisibility && errors.message)
    "
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #default="{ error }">
      <UInput
        v-model.trim="model"
        size="md"
        type="text"
        :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
        @input="backendError = false"
        @blur="errorVisibility = true"
      />
    </template>

    <template #error="{ error }">
      <span class="text-nowrap" :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
