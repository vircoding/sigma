<script setup lang="ts">
defineEmits<{
  (e: 'resend'): void;
}>();

const timer = useTimeout(60);
const count = ref(0);
const progress = computed(() => {
  return (count.value / 60000) * 10000;
});
const disableButton = computed(() => {
  return timer.isRunning.value;
});

defineExpose<{
  disableAndRestart: () => void;
}>({
  disableAndRestart: function () {
    timer.restart();
    const progressInterval = setInterval(() => {
      count.value++;
      if (count.value >= 600) {
        console.log('Un ciclo');
        count.value = 0;
        clearInterval(progressInterval);
      }
    }, 100);
  },
});

function formatSeconds(seconds: number) {
  if (seconds >= 0 && seconds < 10) return `0${seconds}`;
  else return `${seconds}`;
}
</script>

<template>
  <UContainer class="py-10 sm:py-0 md:mx-auto md:w-4/5" :class="[useStyles().pageContainer]">
    <div class="mb-20 flex-col gap-10 sm:mb-12 lg:flex lg:self-center">
      <!-- Hero -->
      <section class="flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Esperando tu verificación
        </h2>
        <p>
          Acabamos de enviarte un correo electrónico con indicaciones para verificar tu cuenta. Si
          no lo has recibido, puedes solicitar el reenvío del mismo, o ponerte en contacto con
          nosotros.
        </p>
      </section>
    </div>

    <div class="flex h-16 items-center gap-x-4">
      <!-- Timer -->
      <div v-if="disableButton" class="relative size-[52px]">
        <svg class="size-[52px] -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Circle -->
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            class="stroke-current text-neutral-300 dark:text-neutral-700"
            stroke-width="3"
          ></circle>
          <!-- Progress Circle -->
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            class="stroke-current text-azure-500 dark:text-azure-400"
            stroke-width="3"
            stroke-dasharray="100"
            :stroke-dashoffset="progress"
            stroke-linecap="round"
          ></circle>
        </svg>

        <!-- Timer Text -->
        <div class="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            class="text-center font-medium"
            :class="[useStyles().textColorPrimary, useStyles().textSizeBase]"
            >{{ timer.minutes.value }}:{{ formatSeconds(timer.seconds.value) }}</span
          >
        </div>
      </div>

      <!-- Button -->
      <button
        class="w-min font-medium"
        :class="[useStyles().linkActiveState, useStyles().textSizeXL]"
        :disabled="disableButton"
        @click="$emit('resend')"
      >
        Reenviar
      </button>
    </div>
  </UContainer>
</template>
