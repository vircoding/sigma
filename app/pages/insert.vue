<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const contactModal = useTemplateRef('contact');

function onAgent() {
  contactModal.value?.openModal();
}
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <!-- Form -->
    <FormInsert @agent="onAgent" />

    <!-- Agent Modal -->
    <ModalContact ref="contact" />
  </UContainer>
</template>
