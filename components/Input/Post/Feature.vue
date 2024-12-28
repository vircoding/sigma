<script setup lang="ts">
import { z, ZodError } from 'zod';

const props = defineProps<{
  name: string;
  label: string;
}>();

const model = defineModel<string>({ required: true });

const schema = z
  .number({ message: 'Entre 0 y 9' })
  .int('Entre 0 y 9')
  .gte(0, 'Entre 0 y 9')
  .lte(9, 'Entre 0 y 9');

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

function onUp() {
  if (model.value !== '') {
    const numericValue = Number(model.value);

    if (numericValue < 9) model.value = (numericValue + 1).toString();
  }
}

function onDown() {
  if (model.value !== '') {
    const numericValue = Number(model.value);

    if (numericValue > 0) model.value = (numericValue - 1).toString();
  }
}

function onBlur() {
  errorVisibility.value = true;
  if (model.value === '') model.value = '0';
}

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
    :label="props.label"
    :name="props.name"
    :error="(backendError && 'Entre 0 y 9') || (errors.error && errorVisibility && errors.message)"
  >
    <template #label="{ error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ props.label }}</span>
    </template>

    <template #default="{ error }">
      <div class="mt-1 flex items-center gap-x-2 min-[380px]:ml-5 min-[380px]:gap-x-3">
        <UInput
          v-model.trim="model"
          size="md"
          type="text"
          inputmode="numeric"
          maxlength="1"
          :ui="{
            base: 'text-center',
          }"
          class="w-9 md:w-10"
          @input="backendError = false"
          @blur="onBlur"
        />

        <!-- Up Button -->
        <ButtonIcon
          :padded="false"
          color="primary"
          variant="link"
          class="bg-primary-100 dark:bg-primary-950/50 relative flex h-7 w-7 items-center justify-center rounded-xl md:h-8 md:w-8"
          :class="{ hidden: error }"
          @click="onUp"
        >
          <UIcon name="i-heroicons-chevron-up-20-solid" class="h-5 w-5 md:h-7 md:w-7" />
        </ButtonIcon>

        <!-- Down Button -->
        <UButton
          :padded="false"
          color="primary"
          variant="link"
          class="bg-primary-100 dark:bg-primary-950/50 relative flex h-7 w-7 items-center justify-center rounded-xl md:h-8 md:w-8"
          :class="{ hidden: error }"
          @click="onDown"
        >
          <UIcon name="i-heroicons-chevron-down-20-solid" class="h-5 w-5 md:h-7 md:w-7" />
        </UButton>

        <!-- Reset Button -->
        <UButton
          :padded="false"
          color="red"
          variant="link"
          class="relative flex h-7 w-7 items-center justify-center rounded-xl bg-red-100 md:h-8 md:w-8 dark:bg-red-950/50"
          :class="{ hidden: !error }"
          @click="model = '0'"
        >
          <UIcon name="i-heroicons-x-mark-20-solid" class="h-4 w-4 md:h-6 md:w-6" />
        </UButton>

        <!-- Exclamation Icon -->
        <div
          class="relative -left-[7px] flex h-7 w-7 items-center justify-center md:h-8 md:w-8"
          :class="{ hidden: !error }"
        >
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="relative h-4 w-4 text-red-500 md:h-6 md:w-6 dark:text-red-400"
          />
        </div>
      </div>
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
