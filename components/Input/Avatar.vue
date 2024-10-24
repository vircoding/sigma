<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  avatar?: string;
}>();

// const emit = defineEmits<{
//   (e: 'upload', imageURL: string): void;
// }>();

const input = ref<HTMLInputElement>();
const isCropperOpen = ref<boolean>(false);
const avatarURL = ref<string | undefined>();

function loadAvatar(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const files = event.target.files;

    if (files) {
      avatarURL.value = URL.createObjectURL(files[0]);
      isCropperOpen.value = true;
      // emit('upload', imageURL);
    }

    event.target.value = '';
  }
}
</script>

<template>
  <div
    class="relative top-4 aspect-square w-24 min-w-24 min-[375px]:w-28 min-[375px]:min-w-28 md:top-6"
  >
    <!-- File Input (Hidden) -->
    <input ref="input" type="file" accept="image/*" hidden @change="loadAvatar" />

    <!-- Avatar -->
    <div class="relative overflow-hidden rounded-full border border-gray-300 dark:border-gray-700">
      <PlaceholderAvatar class="h-full w-full text-gray-300 dark:text-gray-700" />
      <img v-if="props.avatar" :src="props.avatar" class="absolute top-0 h-full w-full" />
    </div>

    <!-- Button -->
    <div
      class="absolute right-0 top-[82px] flex rounded-full border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-neutral-900"
    >
      <ButtonIcon @click="input?.click()">
        <UIcon
          name="i-solar-pen-new-round-linear"
          class="h-5 w-5"
          :class="[useStyles().textColorPrimary, !props.avatar ? 'hidden' : undefined]"
        />

        <UIcon
          name="i-solar-add-circle-broken"
          class="h-5 w-5"
          :class="[useStyles().textColorPrimary, props.avatar ? 'hidden' : undefined]"
        />
      </ButtonIcon>
    </div>

    <UModal v-model="isCropperOpen" :ui="useUIConfigs().cropperModalConfig">
      <div class="p-4">
        <Cropper :src="avatarURL" :auto-zoom="true" class="mb-4" />

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-x-4 px-4">
          <UButton variant="outline" block class="place-self-start">Cancelar</UButton>
          <UButton block class="place-self-end">Recortar</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
