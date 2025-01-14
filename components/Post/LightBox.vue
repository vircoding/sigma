<script setup lang="ts">
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const props = defineProps<{
  images: string[];
  options: object;
}>();

const fancybox = new Fancybox(
  props.images.map((item) => ({
    src: item,
    type: 'image',
  })),
);

const wrapper = useTemplateRef('wrapper');

onMounted(() => {
  Fancybox.bind(wrapper.value, '[data-fancybox]', {
    ...(props.options || {}),
  });
});

onUpdated(() => {
  Fancybox.unbind(wrapper.value);
  Fancybox.close();

  Fancybox.bind(wrapper.value, '[data-fancybox]', {
    ...(props.options || {}),
  });
});

onUnmounted(() => {
  Fancybox.destroy();
});
</script>

<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
