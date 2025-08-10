<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

const props = defineProps<{
  post: UserExchange;
}>();

const { currentIndex, onSwiper, onSlideChange } = useSwiper();
const slides = ref(Array.from({ length: props.post.details.offers }));
</script>

<template>
  <ClientOnly>
    <div class="relative flex w-[calc(100%-94px)] md:w-[calc(100%-108px)]">
      <Swiper
        ref="sliderContainer"
        :slides-per-view="1"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide v-for="(_, index) in slides" :key="index">
          <div class="flex h-full w-full flex-grow flex-col items-center justify-center gap-y-0.5">
            <aside class="flex h-min w-full items-center justify-between px-2">
              <span
                class="relative -top-0.5 font-semibold md:left-2"
                :class="[useStyles().textColorSecondary, useStyles().textSizeXS]"
                >Propiedad {{ index + 1 }}</span
              >
            </aside>
            <CardMinimalPostFeature
              :features="props.post.properties[index].features"
              :gap-compress="true"
              color="affair"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Indicators -->
      <div
        v-if="props.post.details.offers > 1"
        class="absolute right-2 top-2 z-50 flex gap-0.5 rounded-full bg-gray-100 md:right-4 md:top-2.5 dark:bg-gray-800"
      >
        <CardMinimalPostFeatureIndicators
          v-for="(_, index) in slides"
          :key="index"
          :active="currentIndex == index"
        />
      </div>
    </div>
  </ClientOnly>
</template>
