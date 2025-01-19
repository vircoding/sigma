<template>
  <!-- Wrapper -->
  <UContainer class="flex min-h-screen max-w-7xl flex-col">
    <!-- Header -->
    <Header />

    <!-- Content -->
    <div class="flex grow flex-col justify-start pb-6 md:pb-8 lg:justify-center lg:pb-16 lg:pt-14">
      <slot />
    </div>

    <!-- Footer -->
    <Footer />
  </UContainer>
</template>
