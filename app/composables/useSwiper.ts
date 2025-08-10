import type { Swiper } from 'swiper/types';

export default function () {
  const swiperInstance = ref<Swiper | null>(null);
  const currentIndex = ref(0);

  function onSwiper(swiper: Swiper) {
    swiperInstance.value = swiper;
    currentIndex.value = swiper.activeIndex;
  }

  function onSlideChange(swiper: Swiper) {
    currentIndex.value = swiper.activeIndex;
  }

  return {
    swiperInstance,
    currentIndex,
    onSwiper,
    onSlideChange,
  };
}
