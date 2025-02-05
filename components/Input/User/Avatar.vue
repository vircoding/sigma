<script setup lang="ts">
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import type { ImageSize, Coordinates } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  name: string;
  errorVisibility: boolean;
  previousAvatar?: string;
}>();

const valOnChange = ref(false);
const isHelpOpen = ref(false);
const input = useTemplateRef('input');
const cropper = ref<InstanceType<typeof Cropper>>();
const isCropperOpen = ref<boolean>(false);
const loadedURL = ref<string | undefined>();
const croppedURL = ref<string>();

defineModel<Blob>();

const { value, errorMessage } = useField<Blob | undefined>(() => props.name, undefined, {
  syncVModel: true,
  validateOnMount: true,
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

function crop() {
  const result = cropper.value?.getResult();
  if (result?.canvas) {
    result.canvas?.toBlob(
      (blob) => {
        if (blob) {
          croppedURL.value = URL.createObjectURL(blob);
          value.value = blob;
          valOnChange.value = true;
          closeCropper();
        }
      },
      'image/jpeg',
      0.7,
    );
  }
}

function loadAvatar(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const files = event.target.files;

    if (files) {
      loadedURL.value = URL.createObjectURL(files[0]);
      isCropperOpen.value = true;
    }

    event.target.value = '';
  }
}

function onReset() {
  croppedURL.value = undefined;
}

defineExpose<{
  reset: () => void;
}>({
  reset: function () {
    onReset();
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Avatar"
    name="avatar"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
    class="w-min lg:mb-0"
  >
    <template #label="{ label }">
      <span class="invisible">{{ label }}</span>
    </template>

    <template #default="{ error }">
      <div
        class="aspect-square w-24 min-w-24 cursor-pointer min-[375px]:w-28 min-[375px]:min-w-28 md:top-6"
        @click="input?.click()"
      >
        <!-- File Input (Hidden) -->
        <input
          ref="input"
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          hidden
          @change="loadAvatar"
        />

        <!-- Avatar -->
        <div
          class="relative overflow-hidden rounded-full border"
          :class="[
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700',
          ]"
        >
          <!-- Placeholder -->
          <PlaceholderAvatar
            class="h-full w-full"
            :class="[error ? useStyles().textColorError : 'text-gray-300 dark:text-gray-700']"
          />

          <!-- Previous Avatar -->
          <img
            v-show="!croppedURL && props.previousAvatar"
            :src="props.previousAvatar"
            class="absolute top-0 h-full w-full"
          />

          <!-- Cropped Avatar -->
          <img v-show="croppedURL" :src="croppedURL" class="absolute top-0 h-full w-full" />
        </div>

        <!-- Add/Edit Button -->
        <div
          class="absolute right-5 top-[86px] flex rounded-full border bg-white p-1 dark:bg-neutral-900"
          :class="[
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700',
          ]"
        >
          <!-- Add -->
          <UIcon
            v-show="!value && !props.previousAvatar"
            name="i-solar-add-circle-broken"
            class="h-5 w-5"
            :class="[error ? useStyles().textColorError : useStyles().textColorPrimary]"
          />

          <!-- Edit -->
          <UIcon
            v-show="value || props.previousAvatar"
            name="i-solar-pen-new-round-linear"
            class="h-5 w-5"
            :class="[error ? useStyles().textColorError : useStyles().textColorPrimary]"
          />
        </div>

        <!-- Help Button -->
        <button
          type="button"
          class="absolute -right-1 top-[62px] flex rounded-full border bg-white p-1 dark:bg-neutral-900"
          :class="[
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700',
          ]"
          @click.stop="isHelpOpen = true"
        >
          <UPopover v-model="isHelpOpen" overlay :popper="{ offsetDistance: 18 }" class="flex">
            <UIcon
              name="i-solar-question-circle-broken"
              class="h-5 w-5"
              :class="[error ? useStyles().textColorError : useStyles().textColorPrimary]"
            />

            <template #panel>
              <div class="w-[80vw] max-w-[350px] p-1">
                <p class="p-1.5" :class="[useStyles().textSizeXS, useStyles().textColorSecondary]">
                  Sigma hará una compresión de esta imagen para mejorar el tráfico de los usuarios
                  por la plataforma. Si depués de este proceso, el tamaño de la imagen es mayor que
                  5MB, se mostrará una alerta.
                </p>
              </div>
            </template>
          </UPopover>
        </button>

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
                    class="h-6 w-6"
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
                :src="loadedURL"
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
                class="font-bold"
                @click="crop"
              />
            </div>
          </div>
        </UModal>
      </div>
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
