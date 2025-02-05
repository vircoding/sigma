<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const { resetUIPrimary } = useGlobal();

const contactModal = useTemplateRef('contact');

function onAgent() {
  console.log('Agent Event');
  contactModal.value?.openModal();
}

onBeforeRouteLeave(() => {
  resetUIPrimary();
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
