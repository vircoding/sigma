<template>
  <!-- Wrapper -->
  <UContainer class="flex min-h-screen max-w-7xl flex-col">
    <!-- Header -->
    <Header />

    <!-- Content -->
    <div class="flex grow flex-col justify-center pb-16 pt-14">
      <slot />
    </div>

    <!-- Footer -->
    <Footer />
  </UContainer>
</template>
