<script setup lang="ts">
import type { LoginInput } from '~/models/types/User';

definePageMeta({
  middleware: 'no-auth',
});

const isVerify = ref(false);

const loginData = ref<LoginInput>({
  email: '',
  password: '',
});

function onVerify(login: LoginInput) {
  loginData.value = login;
  isVerify.value = true;
}
</script>

<template>
  <div>
    <!-- Verify -->
    <UIVerify v-if="isVerify" ref="verifyComponent" :login-data="loginData" />

    <!-- View -->
    <UContainer v-else :class="[useStyles().pageContainer]">
      <!-- Form -->
      <FormRegisterClient @verify="onVerify" />
    </UContainer>
  </div>
</template>
