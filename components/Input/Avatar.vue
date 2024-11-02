<script setup lang="ts">
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import type { ImageSize, Coordinates } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  avatar?: string;
  error: boolean;
}>();

const emit = defineEmits<{
  (e: 'blur'): void;
  (e: 'crop', imageURL: string): void;
}>();

const input = ref<HTMLInputElement>();
const cropper = ref<InstanceType<typeof Cropper>>();
const isCropperOpen = ref<boolean>(false);
const avatarURL = ref<string | undefined>();

function closeCropper() {
  emit('blur');
  isCropperOpen.value = false;
}

function defaultSize({ imageSize }: { imageSize: ImageSize }) {
  return {
    width: imageSize.width,
    height: imageSize.height,
  };
}

function defaultPosition({
  imageSize,
  coordinates,
}: {
  imageSize: ImageSize;
  coordinates: Coordinates;
}) {
  return {
    left: imageSize.width / 2 - coordinates.width / 2,
    top: imageSize.height / 2 - coordinates.height / 2,
  };
}

function defaultBoundaries({ cropper }: { cropper: HTMLElement }) {
  return {
    width: cropper.clientWidth,
    height: cropper.clientHeight,
  };
}

function crop() {
  const result = cropper.value?.getResult();
  result?.canvas?.toBlob((blob) => {
    if (blob) {
      const croppedAvatarURL = URL.createObjectURL(blob);
      emit('crop', croppedAvatarURL);
    }
  });

  closeCropper();
}

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
    class="aspect-square w-24 min-w-24 cursor-pointer min-[375px]:w-28 min-[375px]:min-w-28 md:top-6"
    @click="input?.click()"
  >
    <!-- File Input (Hidden) -->
    <input ref="input" type="file" accept="image/*" hidden @change="loadAvatar" />

    <!-- Avatar -->
    <div
      class="relative overflow-hidden rounded-full border"
      :class="[
        props.error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700',
      ]"
    >
      <PlaceholderAvatar
        class="h-full w-full"
        :class="[props.error ? useStyles().textColorError : 'text-gray-300 dark:text-gray-700']"
      />
      <img v-if="props.avatar" :src="props.avatar" class="absolute top-0 h-full w-full" />
    </div>

    <!-- Button -->
    <div
      class="absolute right-0 top-[82px] flex rounded-full border bg-white p-1 dark:bg-neutral-900"
      :class="[
        props.error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700',
      ]"
    >
      <UIcon
        name="i-solar-pen-new-round-linear"
        class="h-5 w-5"
        :class="[
          props.error ? useStyles().textColorError : useStyles().textColorPrimary,
          !props.avatar ? 'hidden' : undefined,
        ]"
      />

      <UIcon
        name="i-solar-add-circle-broken"
        class="h-5 w-5"
        :class="[
          props.error ? useStyles().textColorError : useStyles().textColorPrimary,
          props.avatar ? 'hidden' : undefined,
        ]"
      />
    </div>

    <UModal
      v-model="isCropperOpen"
      prevent-close
      :ui="useUIConfigs().cropperModalConfig"
      class="font-quicksand"
    >
      <div class="p-4">
        <!-- Buttons -->
        <div class="flex items-center justify-between px-4">
          <!-- Rotate & Flip -->
          <div class="flex items-center gap-x-2">
            <!-- Rotate Left -->
            <ButtonIcon @click="cropper?.rotate(-90)">
              <UIcon
                name="i-solar-restart-linear"
                class="h-7 w-7 -scale-x-100"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>

            <!-- Rotate Right -->
            <ButtonIcon @click="cropper?.rotate(90)">
              <UIcon
                name="i-solar-restart-linear"
                class="h-7 w-7"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>

            <!-- Flip Horizontal -->
            <ButtonIcon @click="cropper?.flip(true, false)">
              <UIcon
                name="i-solar-flip-horizontal-linear"
                class="ml-0.5 h-7 w-7"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>

            <!-- Flip Vertical -->
            <ButtonIcon @click="cropper?.flip(false, true)">
              <UIcon
                name="i-solar-flip-vertical-linear"
                class="ml-0.5 h-7 w-7"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>
          </div>

          <div class="flex items-center">
            <!-- Close -->
            <ButtonIcon>
              <UIcon
                name="i-uiw-close"
                class="h-6 w-6"
                :class="[useStyles().textColorPrimary]"
                @click="closeCropper"
              />
            </ButtonIcon>
          </div>
        </div>

        <!-- Cropper -->
        <Cropper
          ref="cropper"
          :src="avatarURL"
          :stencil-component="CircleStencil"
          :stencil-props="{
            aspectRatio: 1,
          }"
          :default-position="defaultPosition"
          :default-size="defaultSize"
          :default-boundaries="defaultBoundaries"
          :auto-zoom="true"
          class="my-4 h-96 w-full"
        />

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-x-4">
          <!-- Reset -->
          <UButton
            label="Restablecer"
            variant="solid"
            size="md"
            block
            :ui="useUIConfigs().cancelButtonConfig"
            class="font-bold"
            @click="cropper?.reset()"
          />

          <!-- Crop -->
          <UButton
            label="Aceptar"
            variant="solid"
            size="md"
            block
            :ui="useUIConfigs().acceptButtonConfig"
            class="dropsha font-bold"
            @click="crop"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>

<style>
.vue-advanced-cropper__background {
  background-color: white;
}

html.dark .vue-advanced-cropper__background {
  background-color: black;
}

.vue-simple-handler {
  background-color: white;
  border-radius: 50%;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
}

html.dark .vue-simple-handler {
  background-color: #e5e5e5;
}
</style>
