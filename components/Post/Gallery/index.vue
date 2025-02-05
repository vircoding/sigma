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
      class="overflow-hidden lg:rounded-xl"
      indicators
    >
      <template #default="{ item }">
        <img
          :src="item"
          class="w-full"
          draggable="true"
          @touchend="touched = true"
          @click="touched = true"
        />
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
          <PostGalleryFullscreen
            ref="zoomer"
            :src="props.images[currentPage]"
            :options="{ maxScale: 3, minScale: 1, step: 0.5 }"
          />
        </div>

        <!-- Mobile Arrows -->
        <PostGalleryControllers
          :current="carousel.page"
          :total="props.images.length"
          @prev="onPrev"
          @next="onNext"
          @zoom-in="onZoomIn"
          @zoom-out="onZoomOut"
          @close="isFullscreen = false"
        />
      </UContainer>
    </UModal>
  </div>
</template>
