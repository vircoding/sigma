<script setup lang="ts">
const model = defineModel<
  {
    imageURL: string | undefined;
    blob: Blob | undefined;
  }[]
>();

const props = defineProps<{
  type: 'sale' | 'rent' | 'exchange';
}>();

const emit = defineEmits<{
  (e: 'push'): void;
}>();

function handleCrop(index: number, imageURL: string, file: Blob) {
  if (model.value && model.value[index]) {
    model.value[index].imageURL = imageURL;
    model.value[index].blob = file;
    emit('push');
    // resetBackendError('avatar');
    // errorVisibility.value.avatar = true;
  }
}
</script>

<template>
  <div
    class="mt-1 flex w-full items-center rounded-xl border border-gray-300 px-5 py-4 lg:min-h-[412px] dark:border-gray-700"
  >
    <div
      class="relative flex h-fit w-full grid-cols-3 grid-rows-4 flex-col place-items-center items-center gap-x-3 gap-y-3 lg:grid"
    >
      <InputImageItem
        v-for="(image, index) in model"
        :key="index"
        :index="index"
        :type="props.type"
        :image="image.imageURL"
        :error="false"
        :class="{ hidden: index >= 10 }"
        @crop="handleCrop"
      />
    </div>
  </div>
</template>
