<template>
  <footer class="flex flex-col">
    <!-- Divider -->
    <UDivider type="dotted">
      <LogoHorizontal class="w-28 text-azure-950 sm:w-32 dark:text-gray-200" />
    </UDivider>

    <!-- Mobile -->
    <FooterMobile v-if="$device.isMobileOrTablet" />

    <!-- Desktop -->
    <FooterDesktop v-else />
  </footer>
</template>
