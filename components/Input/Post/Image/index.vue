<script setup lang="ts">
import { z, ZodError } from 'zod';
import type { Image } from '~/models/PostTypes';

const model = defineModel<Image[]>({ required: true });

const schema = z.string().array().nonempty();

const errors = computed<{
  error: boolean;
  message?: string;
}>(() => {
  try {
    const urls = model.value.map((item) => item.imageURL);

    schema.parse(urls);
    return { error: false };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((issue) => issue.message);

      return { error: messages.length !== 0, message: messages[0] || '' };
    }

    return { error: true };
  }
});

const backendError = ref<boolean[]>([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);
const errorVisibility = ref(false);

function handleCrop(index: number, imageURL: string, blob: Blob) {
  model.value[index] = { imageURL, blob };
  if (backendError.value[index]) {
    backendError.value[index] = false;
  }
  errorVisibility.value = true;
}

function handleRemove(index: number) {
  if (model.value[index]) {
    model.value.splice(index, 1);
  }
}

defineExpose<{
  setBackendError: (index: number) => void;
  setErrorVisibility: () => void;
  hasError: () => boolean;
}>({
  setBackendError: function (index: number) {
    backendError.value[index] = true;
  },

  setErrorVisibility: function () {
    errorVisibility.value = true;
  },
  hasError: function () {
    return errors.value.error;
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Imágenes (Mínimo 1)"
    name="images"
    :error="errors.error && errorVisibility && 'Debe contener al menos una imagen'"
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #hint="{ error }">
      <span
        class="mr-2"
        :class="[
          useStyles().textSizeXS,
          error ? useStyles().textColorError : useStyles().textColorPrimary,
        ]"
        >{{ model.length }}/10</span
      >
    </template>

    <template #default>
      <div
        class="mt-1 flex w-full items-center rounded-xl border border-gray-300 px-5 py-4 lg:min-h-[412px] dark:border-gray-700"
        :class="{ 'border-red-500 dark:border-red-400': errors.error && errorVisibility }"
      >
        <div
          class="relative flex h-fit w-full grid-cols-3 grid-rows-4 flex-col place-items-center items-center gap-x-3 gap-y-3 lg:grid"
        >
          <!-- Items -->
          <InputPostImageItem
            v-for="(image, index) in model"
            :key="index"
            :index="index"
            :image="image.imageURL"
            @crop="handleCrop"
            @remove="handleRemove"
          />

          <!-- Add -->
          <InputPostImageItem
            v-show="model.length < 10"
            :index="model.length"
            :error="errors.error && errorVisibility"
            @crop="handleCrop"
          />
        </div>
      </div>
    </template>
  </UFormGroup>
</template>
