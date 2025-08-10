<script setup lang="ts">
import { Cropper, RectangleStencil } from 'vue-advanced-cropper';
import type { ImageSize, Coordinates } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  image?: string;
  index: number;
  backendError: boolean;
}>();

const emit = defineEmits<{
  (e: 'crop', index: number, imageURL: string, file: Blob): void;
  (e: 'remove', index: number): void;
}>();

const input = useTemplateRef('input');
const cropper = ref<InstanceType<typeof Cropper>>();
const isCropperOpen = ref<boolean>(false);
const imageURL = ref<string | undefined>();

const imageURLErrorMEssage = useFieldError(() => `images[${props.index}].imageURL`);
const blobErrorMEssage = useFieldError(() => `images[${props.index}].blob`);

const colorStyles = computed(() => {
  if (imageURLErrorMEssage.value && blobErrorMEssage.value)
    return {
      background: 'bg-red-100 dark:bg-red-950/50',
      focus: 'focus-visible:ring-red-500 dark:focus:ring-red-400',
    };
  else
    return {
      background: 'bg-primary-100 dark:bg-primary-950/50',
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
          emit('crop', props.index, croppedAvatarURL, blob);
          closeCropper();
        }
      },
      'image/jpeg',
      0.7,
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

function onClick() {
  input.value?.click();
}
</script>

<template>
  <div
    class="aspect-video w-full min-w-24 cursor-pointer rounded-xl p-px ring-inset focus:outline-none focus-visible:outline-0 focus-visible:ring-2 md:top-6 lg:w-[118px] min-[1124px]:w-[136px] min-[1180px]:w-[152px]"
    :class="[colorStyles.focus]"
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
      :class="[
        colorStyles.background,
        props.backendError ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-red-400' : undefined,
      ]"
    >
      <!-- Image -->
      <img :src="props.image" class="w-full rounded-xl" />

      <!-- Background Overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 top-0"
        style="background-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.8) 100%)"
      ></div>

      <!-- Overlay -->
      <div
        class="absolute bottom-0 left-[80%] top-0 flex flex-col items-center justify-center gap-y-3 min-[400px]:gap-y-5 min-[450px]:gap-y-8 lg:left-[70%] lg:gap-y-px"
      >
        <!-- Edit -->
        <ButtonIcon class="flex items-center justify-center rounded-xl" @click.stop="onClick">
          <UIcon
            name="i-solar-pen-broken"
            class="h-8 w-8 text-white min-[450px]:h-11 min-[450px]:w-11 min-[545px]:h-[52px] min-[545px]:w-[52px] lg:h-5 lg:w-5 min-[1180px]:h-6 min-[1180px]:w-6 dark:text-gray-200"
          />
        </ButtonIcon>

        <!-- Remove -->
        <ButtonIcon
          class="flex items-center justify-center rounded-xl"
          @click.stop="$emit('remove', props.index)"
        >
          <UIcon
            name="i-solar-trash-bin-trash-broken"
            class="h-9 w-9 text-white min-[450px]:h-12 min-[450px]:w-12 min-[545px]:h-14 min-[545px]:w-14 lg:h-6 lg:w-6 min-[1180px]:h-7 min-[1180px]:w-7 dark:text-gray-200"
          />
        </ButtonIcon>
      </div>
    </div>

    <!-- Desktop Avatar -->
    <div
      v-else
      class="group/overlay relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      :class="[
        colorStyles.background,
        props.backendError ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-red-400' : undefined,
      ]"
    >
      <!-- Image -->
      <img :src="props.image" class="top-0 h-full w-full" />

      <!-- Overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-x-3 bg-transparent duration-100 group-hover/overlay:bg-gray-950/50 has-[:focus]:bg-gray-950/50 dark:group-hover/overlay:bg-gray-950/70 dark:has-[:focus]:bg-gray-950/70"
      >
        <!-- Edit -->
        <ButtonIcon
          class="group/button flex items-center justify-center rounded-xl duration-100 hover:scale-125 focus:scale-125"
          @click.stop="onClick"
        >
          <UIcon
            name="i-solar-pen-broken"
            class="h-8 w-8 text-transparent group-hover/overlay:text-white group-focus/button:text-white min-[450px]:h-11 min-[450px]:w-11 min-[545px]:h-[52px] min-[545px]:w-[52px] lg:h-7 lg:w-7 min-[1180px]:h-8 min-[1180px]:w-8"
          />
        </ButtonIcon>

        <!-- Remove -->
        <ButtonIcon
          class="group/button flex items-center justify-center rounded-xl duration-100 hover:scale-125 focus:scale-125"
          @click.stop="$emit('remove', props.index)"
        >
          <UIcon
            name="i-solar-trash-bin-trash-broken"
            class="h-9 w-9 text-transparent group-hover/overlay:text-white group-focus/button:text-white min-[450px]:h-12 min-[450px]:w-12 min-[545px]:h-14 min-[545px]:w-14 lg:h-8 lg:w-8 min-[1180px]:h-9 min-[1180px]:w-9"
          />
        </ButtonIcon>
      </div>
    </div>

    <!-- Cropper Modal -->
    <UModal
      v-model="isCropperOpen"
      prevent-close
      :ui="useUIConfig().cropperModalConfig"
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
            :ui="useUIConfig().cancelButtonConfig"
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
            :ui="useUIConfig().acceptButtonConfig"
            :disabled="disableButtons"
            class="font-bold"
            @click="crop"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>
