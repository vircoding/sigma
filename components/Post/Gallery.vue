<script setup lang="ts">
const props = defineProps<{
  images: string[];
}>();

const carousel = ref();
const touched = ref(false);

onMounted(() => {
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
  <UCarousel
    ref="carousel"
    :items="props.images"
    :ui="{
      item: 'basis-full',
      indicators: { wrapper: 'bg-black/70 w-min px-2.5 py-1.5 gap-1 left-4 rounded-xl' },
    }"
    class="overflow-hidden"
    indicators
  >
    <template #default="{ item }">
      <img :src="item" class="w-full" draggable="true" @touchend="touched = true" />
    </template>

    <template #indicator="{ onClick, page, active }">
      <button
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
</template>
