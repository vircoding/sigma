<script setup lang="ts">
const modalConfig = {
  background: 'bg-transparent dark:bg-transparent',
};
</script>

<template>
  <UModal fullscreen :ui="modalConfig" prevent-close>
    <UContainer>
      <div class="flex h-dvh items-center gap-x-2">
        <div class="loader scale-[.80]"></div>
        <div class="text-loader font-ubuntu"></div>
      </div>
    </UContainer>
  </UModal>
</template>

<style scoped>
.loader {
  width: 65px;
  aspect-ratio: 1;
  --g: radial-gradient(
      farthest-side,
      #0000 calc(95% - 5px),
      #162743 calc(100% - 5px) 98%,
      #0000 101%
    )
    no-repeat;
  background: var(--g), var(--g), var(--g);
  background-size: 30px 30px;
  animation: spinner-animation 2s infinite;
}

html.dark .loader {
  aspect-ratio: 1;
  --g: radial-gradient(
      farthest-side,
      #0000 calc(95% - 5px),
      #e5e5e5 calc(100% - 5px) 98%,
      #0000 101%
    )
    no-repeat;
}

@keyframes spinner-animation {
  0% {
    background-position:
      0 0,
      0 100%,
      100% 100%;
  }
  25% {
    background-position:
      100% 0,
      0 100%,
      100% 100%;
  }
  50% {
    background-position:
      100% 0,
      0 0,
      100% 100%;
  }
  75% {
    background-position:
      100% 0,
      0 0,
      0 100%;
  }
  100% {
    background-position:
      100% 100%,
      0 0,
      0 100%;
  }
}

.text-loader {
  width: fit-content;
  padding-bottom: 2px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 40px;
  overflow: hidden;
  color: #0000;
  text-shadow:
    0 0 0 #162743,
    10ch 0 0 #162743;
  animation: text-animation-light 2s infinite ease-in;
}

html.dark .text-loader {
  text-shadow:
    0 0 0 #e5e5e5,
    10ch 0 0 #e5e5e5;
  animation: text-animation-dark 2s infinite ease-in;
}

.text-loader:before {
  content: 'Cargando';
}

@keyframes text-animation-light {
  80% {
    text-shadow:
      0 0 0 #162743,
      10ch 0 0 #162743;
    background-size: 100% 3px;
  }
  100% {
    text-shadow:
      -10ch 0 0 #162743,
      0 0 0 #162743;
  }
}

@keyframes text-animation-dark {
  80% {
    text-shadow:
      0 0 0 #e5e5e5,
      10ch 0 0 #e5e5e5;
    background-size: 100% 3px;
  }
  100% {
    text-shadow:
      -10ch 0 0 #e5e5e5,
      0 0 0 #e5e5e5;
  }
}
</style>
