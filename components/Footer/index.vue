<template>
  <footer class="flex flex-col">
    <!-- Divider -->
    <UDivider type="dashed">
      <LogoHorizontal class="w-28 sm:w-32 md:w-[136px]" :class="[useStyles().textColorPrimary]" />
    </UDivider>

    <!-- Mobile -->
    <FooterMobile v-if="$device.isMobileOrTablet" />

    <!-- Desktop -->
    <FooterDesktop v-else />
  </footer>
</template>
