<script setup lang="ts">
import Panzoom from '@panzoom/panzoom';
import type { PanzoomEventDetail, PanzoomObject } from '@panzoom/panzoom';

const props = defineProps<{
  src: string;
  options: object;
}>();

defineExpose<{
  zoomIn: () => void;
  zoomOut: () => void;
}>({
  zoomIn: function () {
    panzoom.zoomIn({ animate: true });
  },
  zoomOut: function () {
    panzoom.zoomOut({ animate: true });
  },
});

const zoomer = useTemplateRef('zoomer');
let panzoom: PanzoomObject;

function onWheel(event: WheelEvent) {
  panzoom.zoomWithWheel(event);
}

onMounted(() => {
  if (zoomer.value) {
    panzoom = Panzoom(zoomer.value, props.options);
    zoomer.value.addEventListener('panzoomchange', (event) => {
      if (event instanceof CustomEvent && event.detail) {
        const detail = event.detail as PanzoomEventDetail;

        if (detail.scale === 1) {
          panzoom.pan(0, 0, { animate: true });
        }
      }
    });
  }
});

onUnmounted(() => {
  if (zoomer.value) {
    panzoom.destroy();
  }
});
</script>

<template>
  <div class="flex h-full w-full flex-col justify-center px-4 lg:px-56">
    <img ref="zoomer" :src="props.src" class="rounded-xl" @wheel="onWheel" />
  </div>
</template>
