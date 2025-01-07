<script setup lang="ts">
import { Cropper, RectangleStencil } from 'vue-advanced-cropper';
import type { ImageSize, Coordinates } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  index: number;
  error: boolean;
}>();

const emit = defineEmits<{
  (e: 'crop', imageURL: string, file: Blob): void;
}>();

const input = useTemplateRef('input');
const cropper = ref<InstanceType<typeof Cropper>>();
const isCropperOpen = ref<boolean>(false);
const imageURL = ref<string | undefined>();

const colorStyles = computed(() => {
  if (props.error)
    return {
      background: 'bg-red-100 dark:bg-red-950/50',
      text: 'text-red-500 dark:text-red-400',
      focus: 'focus-visible:ring-red-500 dark:focus:ring-red-400',
    };
  else
    return {
      background: 'bg-primary-100 dark:bg-primary-950/50',
      text: 'text-primary-500 dark:text-primary-400',
      focus: 'focus-visible:ring-primary-500 dark:focus:ring-primary-400',
    };
});

function closeCropper() {
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

const disableButtons = ref(false);

function crop() {
  disableButtons.value = true;
  const result = cropper.value?.getResult();
  if (result?.canvas) {
    result.canvas?.toBlob(
      (blob) => {
        if (blob) {
          const croppedAvatarURL = URL.createObjectURL(blob);
          emit('crop', croppedAvatarURL, blob);
          closeCropper();
        }
      },
      'image/jpeg',
      // 0.7,
    );
  }
}

function loadImage(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const files = event.target.files;

    if (files) {
      disableButtons.value = false;
      imageURL.value = URL.createObjectURL(files[0]);
      isCropperOpen.value = true;
    }

    event.target.value = '';
  }
}
</script>

<template>
  <button
    type="button"
    class="group aspect-video w-full min-w-24 cursor-pointer rounded-xl p-px focus:outline-none focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-offset-1 md:top-6 lg:w-[118px] min-[1124px]:w-[136px] min-[1180px]:w-[152px]"
    :class="[colorStyles.focus]"
    @click="input?.click()"
  >
    <!-- File Input (Hidden) -->
    <input
      ref="input"
      type="file"
      accept="image/jpeg, image/png, image/gif, image/webp"
      hidden
      @change="loadImage"
    />

    <!-- Mobile Image -->
    <div
      v-if="$device.isMobileOrTablet"
      class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      :class="[colorStyles.background]"
    >
      <!-- Placeholder -->
      <PlaceholderImage class="h-[40%] w-[40%]" :class="[colorStyles.text]" />
    </div>

    <!-- Desktop Image -->
    <div
      v-else
      class="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      :class="[colorStyles.background]"
    >
      <!-- Placeholder -->
      <PlaceholderImage
        class="h-[40%] w-[40%] duration-100 group-hover:scale-125 group-focus:scale-125 lg:h-11 lg:w-11"
        :class="[colorStyles.text]"
      />
    </div>

    <!-- Cropper Modal -->
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
                name="i-heroicons-x-mark-20-solid"
                class="h-8 w-8"
                :class="[useStyles().textColorPrimary]"
                @click="closeCropper"
              />
            </ButtonIcon>
          </div>
        </div>

        <!-- Cropper -->
        <div class="relative">
          <!-- Skeleton -->
          <div class="absolute bottom-0 left-0 right-0 top-0">
            <USkeleton class="h-full w-full" :ui="{ rounded: 'rounded-none' }" />
          </div>

          <Cropper
            ref="cropper"
            :src="imageURL"
            :stencil-component="RectangleStencil"
            :stencil-props="{
              aspectRatio: 16 / 9,
            }"
            :default-position="defaultPosition"
            :default-size="defaultSize"
            :default-boundaries="defaultBoundaries"
            :auto-zoom="true"
            class="my-4 h-96 w-full"
          />
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-x-4">
          <!-- Reset -->
          <UButton
            label="Restablecer"
            variant="solid"
            size="md"
            block
            :ui="useUIConfigs().cancelButtonConfig"
            :disabled="disableButtons"
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
            :disabled="disableButtons"
            class="font-bold"
            @click="crop"
          />
        </div>
      </div>
    </UModal>
  </button>
</template>
