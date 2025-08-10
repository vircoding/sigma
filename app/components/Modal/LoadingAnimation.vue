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
