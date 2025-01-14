<script setup lang="ts">
const props = defineProps<{
  images: string[];
}>();

const carousel = ref();
const zoomer = useTemplateRef('zoomer');

const touched = ref(false);
const isFullscreen = ref(false);

const carouselConfig = computed(() => {
  return {
    item: 'basis-full',
    indicators: {
      wrapper: `${props.images.length !== 1 ? 'bg-black/70' : ''} w-min px-2.5 py-1.5 gap-1 left-4 rounded-xl`,
    },
  };
});

const currentPage = computed(() => {
  return carousel.value?.page - 1 || 0;
});

const hasPrev = computed(() => {
  if (carousel.value) {
    return carousel.value.page > 1;
  } else return false;
});

const hasNext = computed(() => {
  if (carousel.value) {
    return carousel.value.page < carousel.value.pages;
  } else return false;
});

function openFullscreen() {
  touched.value = true;
  isFullscreen.value = true;
}

function onZoomIn() {
  if (zoomer.value) {
    zoomer.value.zoomIn();
  }
}

function onZoomOut() {
  if (zoomer.value) {
    zoomer.value.zoomOut();
  }
}

function onPrev() {
  if (carousel.value) {
    carousel.value.prev();
    touched.value = true;
  }
}

function onNext() {
  if (carousel.value) {
    carousel.value.next();
    touched.value = true;
  }
}

onMounted(() => {
  // Autoplay
  setInterval(() => {
    if (!carousel.value) return;

    if (!touched.value) {
      if (carousel.value.page === carousel.value.pages) {
        return carousel.value.select(0);
      }

      carousel.value.next();
    }
  }, 5000);
});
</script>

<template>
  <div class="relative">
    <!-- Gallery -->
    <UCarousel
      ref="carousel"
      :items="props.images"
      :ui="carouselConfig"
      class="overflow-hidden"
      indicators
    >
      <template #default="{ item }">
        <img :src="item" class="w-full" draggable="true" @touchend="touched = true" />
      </template>

      <!-- Indicators -->
      <template #indicator="{ onClick, page, active }">
        <button
          type="button"
          class="h-[11px] w-[11px] rounded-full border border-white"
          :class="active ? 'bg-white' : 'bg-transparent'"
          @click="
            () => {
              onClick(page);
              touched = true;
            }
          "
        ></button>
      </template>
    </UCarousel>

    <!-- Open Fullscreen -->
    <button
      type="button"
      class="absolute bottom-4 right-4 flex rounded-xl bg-black/70 px-2 pb-1 pt-[5px]"
      @click="openFullscreen"
    >
      <UIcon name="i-heroicons-tv" class="h-7 w-7 text-white" />
    </button>

    <!-- Fullscreen Gallery -->
    <UModal
      v-model="isFullscreen"
      fullscreen
      prevent-close
      :ui="{ background: 'bg-transparent dark:bg-transparent' }"
    >
      <UContainer :ui="{ padding: 'px-0 sm:px-0 lg:px-0', constrained: 'max-w-none' }">
        <!-- Zoomer -->
        <div class="flex h-dvh items-center gap-x-2">
          <PostFullscreen
            ref="zoomer"
            :src="props.images[currentPage]"
            :options="{ maxScale: 3, minScale: 1, step: 0.5 }"
          />
        </div>

        <!-- Buttons -->
        <div class="absolute right-4 top-4 flex items-center gap-x-3">
          <!-- Zoom In -->
          <button type="button" class="hidden lg:flex" @click="onZoomIn">
            <UIcon
              name="i-heroicons-magnifying-glass-plus-20-solid"
              class="h-8 w-8"
              :class="[useStyles().textColorPrimary]"
            />
          </button>

          <!-- Zoom Out -->
          <button type="button" class="hidden lg:flex" @click="onZoomOut">
            <UIcon
              name="i-heroicons-magnifying-glass-minus-20-solid"
              class="h-8 w-8"
              :class="[useStyles().textColorPrimary]"
            />
          </button>

          <!-- Close Fullscreen -->
          <button type="button" class="flex" @click="isFullscreen = false">
            <UIcon name="i-charm-cross" class="h-8 w-8" :class="[useStyles().textColorPrimary]" />
          </button>
        </div>

        <!-- Mobile Arrows -->
        <div
          class="absolute bottom-8 left-[calc(50%-82px)] flex items-center justify-center gap-x-2 rounded-xl bg-gray-300/30 px-3.5 py-1 drop-shadow-xl backdrop-blur-md lg:hidden dark:bg-gray-800/60"
        >
          <!-- Prev Arrow -->
          <button type="button" :disabled="!hasPrev" class="flex" @click="onPrev">
            <UIcon
              name="i-charm-chevron-left"
              class="h-7 w-7"
              :class="hasPrev ? [useStyles().primary] : 'text-gray-400'"
            />
          </button>

          <!-- Zoom In -->
          <button type="button" :disabled="!hasPrev" class="flex" @click="onZoomIn">
            <UIcon
              name="i-heroicons-magnifying-glass-plus-20-solid"
              class="h-7 w-7"
              :class="hasPrev ? [useStyles().primary] : 'text-gray-400'"
            />
          </button>

          <!-- Zoom Out -->
          <button type="button" :disabled="!hasPrev" class="flex" @click="onZoomOut">
            <UIcon
              name="i-heroicons-magnifying-glass-minus-20-solid"
              class="h-7 w-7"
              :class="hasPrev ? [useStyles().primary] : 'text-gray-400'"
            />
          </button>

          <!-- Next Arrow -->
          <button type="button" :disabled="!hasNext" class="flex" @click="onNext">
            <UIcon
              name="i-charm-chevron-right"
              class="h-7 w-7"
              :class="hasNext ? [useStyles().primary] : 'text-gray-400'"
            />
          </button>
        </div>

        <!-- Desktop Prev Arrow -->
        <button
          v-show="hasPrev"
          type="button"
          :disabled="!hasPrev"
          class="absolute left-4 top-[calc(50%-22px)] hidden items-center rounded-full bg-gray-200/30 p-1.5 drop-shadow-xl backdrop-blur-md lg:flex dark:bg-gray-800/60"
          @click="onPrev"
        >
          <UIcon
            name="i-charm-chevron-left"
            class="relative -left-px h-8 w-8"
            :class="[useStyles().primary]"
          />
        </button>

        <!-- Desktop Next Arrow -->
        <button
          v-show="hasNext"
          type="button"
          :disabled="!hasNext"
          class="absolute right-4 top-[calc(50%-22px)] hidden items-center rounded-full bg-gray-200/30 p-1.5 drop-shadow-xl backdrop-blur-md lg:flex dark:bg-gray-800/60"
          @click="onNext"
        >
          <UIcon
            name="i-charm-chevron-right"
            class="relative -right-px h-8 w-8"
            :class="[useStyles().textColorPrimary]"
          />
        </button>
      </UContainer>
    </UModal>
  </div>
</template>
