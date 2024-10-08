<template>
  <!-- Wrapper -->
  <UContainer class="flex min-h-screen max-w-7xl flex-col">
    <!-- Header -->
    <Header />

    <!-- Content -->
    <div class="grow py-10">
      <slot />
    </div>

    <!-- Footer -->
    <Footer />
  </UContainer>
</template>
