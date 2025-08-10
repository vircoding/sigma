<script setup lang="ts">
definePageMeta({
  middleware: 'no-auth',
});

const isResetPassword = ref(false);
</script>

<template>
  <div>
    <!-- Reset Password -->
    <UIResetPassword v-if="isResetPassword" @cancel="isResetPassword = false" />

    <!-- View -->
    <UContainer v-else :class="[useStyles().pageContainer]">
      <!-- Form -->
      <FormLogin @reset-password="isResetPassword = true" />
    </UContainer>
  </div>
</template>
