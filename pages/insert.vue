<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const appConfig = useAppConfig();
const contactModal = useTemplateRef('contact');

function onAgent() {
  console.log('Agent Event');
  contactModal.value?.openModal();
}

onUnmounted(() => {
  appConfig.ui.primary = 'azure';
});
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <!-- Form -->
    <FormInsert @agent="onAgent" />

    <!-- Agent Modal -->
    <ModalContact ref="contact" />
  </UContainer>
</template>
