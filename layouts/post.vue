<template>
  <!-- Wrapper -->
  <UContainer class="flex min-h-screen max-w-7xl flex-col">
    <!-- Header -->
    <Header />

    <!-- Content -->
    <div class="flex grow flex-col justify-start pb-6">
      <slot />
    </div>

    <!-- Footer -->
    <Footer />
  </UContainer>
</template>
