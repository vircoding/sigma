<script setup lang="ts">
import { z, ZodError } from 'zod';

const model = defineModel<string>({ required: true });

const schema = z
  .string({ message: 'La Descripción no es válida' })
  .trim()
  .max(1250, 'No puede exceder los 1250 caracteres')
  .optional();

const errors = computed<{
  error: boolean;
  message?: string;
}>(() => {
  try {
    schema.parse(model.value);

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

defineExpose<{
  setBackendError: () => void;
}>({
  setBackendError: function () {
    backendError.value = true;
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Descripción (Opcional)"
    name="description"
    :error="(backendError && 'La Descripción no es válida') || (errors.error && errors.message)"
  >
    <template #label="{ label, error }">
      <span class="h-min" :class="[error ? useStyles().textColorError : undefined]">{{
        label
      }}</span>
    </template>

    <template #hint="{ error }">
      <span
        class="mr-2"
        :class="[
          useStyles().textSizeXS,
          error ? useStyles().textColorError : useStyles().textColorPrimary,
        ]"
        >{{ model.length }}/1250<span class="hidden min-[414px]:inline"> caracteres</span></span
      >
    </template>

    <template #default="{ error }">
      <UTextarea
        v-model.trim="model"
        placeholder="Sin Descripción"
        size="md"
        :rows="12"
        type="text"
        :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
        @input="backendError = false"
      />
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
