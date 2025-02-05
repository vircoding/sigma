<script setup lang="ts">
import type { Image } from '~/models/types/Post';

const props = defineProps<{
  name: string;
  modelValue: Image[];
  errorVisibility: boolean;
}>();

const valOnChange = ref(false);

const model = defineModel<Image[]>({ required: true });

const backendErrors = ref([false, false, false, false, false, false, false, false, false, false]);

const { errorMessage, validate } = useField(() => props.name, undefined, {
  syncVModel: true,
  validateOnMount: true,
});

const { update, push, remove, fields } = useFieldArray<Image>(() => props.name);

function onUpdate(index: number, imageURL: string, blob: Blob) {
  if (backendErrors.value[index]) backendErrors.value[index] = false;
  update(index, { imageURL, blob });
  validate();
}

function onPush(imageURL: string, blob: Blob) {
  push({ imageURL, blob });
  valOnChange.value = true;
  validate();
}

function handleRemove(index: number) {
  remove(index);
  validate();
}

defineExpose<{
  setBackendError: (index: number) => void;
}>({
  setBackendError: function (index: number) {
    backendErrors.value[index] = true;
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Imágenes (Mínimo 1)"
    name="images"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
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
        :class="{
          'border-red-500 dark:border-red-400':
            (props.errorVisibility || valOnChange) && errorMessage,
        }"
      >
        <div
          class="relative flex h-fit w-full grid-cols-3 grid-rows-4 flex-col place-items-center items-center gap-x-3 gap-y-3 lg:grid"
        >
          <!-- Items -->
          <InputPostImageItem
            v-for="(image, index) in fields"
            :key="image.value.imageURL"
            :index="index"
            :image="image.value.imageURL"
            :backend-error="backendErrors[index]"
            @crop="onUpdate"
            @remove="handleRemove"
          />

          <!-- Add -->
          <InputPostImageAdd
            v-show="model.length < 10"
            :index="model.length"
            :error="(valOnChange || props.errorVisibility) && !!errorMessage"
            @crop="onPush"
          />
        </div>
      </div>
    </template>
  </UFormGroup>
</template>
