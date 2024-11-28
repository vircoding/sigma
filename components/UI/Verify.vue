<script setup lang="ts">
const emit = defineEmits<{
  (e: 'resend' | 'return'): void;
}>();

const progressInterval = setInterval(() => {
  if (timer.isRunning.value) {
    timestamp.value = Date.now();
  }
}, 100);

const timer = useTimeout(60);
const timestamp = ref(Date.now());
const progress = computed(() => {
  return 100 - (timer.stopTime - timestamp.value) / 600;
});
const disableButton = computed(() => {
  return timer.isRunning.value;
});
const isHelpOpen = ref(false);
const showHelp = ref(false);
const helpCounter = ref(0);

defineExpose<{
  disableAndRestart: () => void;
}>({
  disableAndRestart: function () {
    helpCounter.value += 1;
    timer.restart();
  },
});

function formatSeconds(seconds: number) {
  if (seconds >= 0 && seconds < 10) return `0${seconds}`;
  else return `${seconds}`;
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    emit('return');
    showHelp.value = true;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  clearInterval(progressInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <UContainer class="py-10 sm:py-0 md:mx-auto md:w-4/5" :class="[useStyles().pageContainer]">
    <div class="mb-14 flex-col gap-10 sm:mb-9 lg:flex lg:self-center">
      <!-- Hero -->
      <section class="flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Esperando tu verificación
        </h2>
        <p>
          Acabamos de enviarte un correo con indicaciones para verificar tu cuenta. Una vez
          completes el proceso, esta página iniciará sesión con tu nueva cuenta automáticamente. Si
          aún no has recibido el correo, puedes solicitar el reenvío del mismo, o ponerte en
          contacto con nosotros.
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
        class="w-min font-semibold"
        :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
        :disabled="disableButton"
        @click="$emit('resend')"
      >
        Reenviar
      </button>

      <!-- Help Button -->
      <div
        class="relative -top-px flex rounded-full border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-neutral-900"
        :class="{ hidden: !showHelp && helpCounter < 2 }"
        @click="isHelpOpen = true"
      >
        <UPopover
          v-model="isHelpOpen"
          overlay
          :popper="{ offsetDistance: 18, placement: 'top' }"
          class="flex"
        >
          <UIcon
            name="i-solar-question-circle-broken"
            class="h-5 w-5"
            :class="[useStyles().textColorPrimary]"
          />

          <template #panel>
            <div class="w-[80vw] max-w-[350px] p-1">
              <p class="p-1.5" :class="[useStyles().textSizeXS, useStyles().textColorSecondary]">
                Si ya has verificado tu cuenta a través del correo electrónico, y estás atrapado en
                esta página, intenta iniciar sesión manualmente
                <NuxtLink :to="{ name: 'auth-login' }"
                  ><span class="font-bold underline" :class="[useStyles().textColorPrimary]"
                    >aquí</span
                  ></NuxtLink
                >. En cambio, si no recibes el correo de verificación y estás seguro de haber
                proporcionado la dirección correcta; revisa tu bandeja de spam, o ponte en contacto
                con
                <a href="mailto:sigmacuba2023@gmail.com"
                  ><span class="font-bold underline" :class="[useStyles().textColorPrimary]"
                    >nuestro soporte</span
                  ></a
                >.
              </p>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </UContainer>
</template>
