<script setup lang="ts">
import { z, ZodError } from 'zod';

const model = defineModel<string>({ required: true });

const schema = z
  .number({ message: 'Debe ser un precio válido' })
  .int('Debe ser un precio válido')
  .gte(1, 'Debe ser un precio válido')
  .lte(999999999, 'Debe ser un precio válido');

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
    label="Precio"
    name="amount"
    :error="
      (backendError && 'Debe ser un precio válido') ||
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
