<template>
  <header>
    <!-- Mobile -->
    <HeaderMobile v-if="$device.isMobileOrTablet" />

    <!-- Desktop -->
    <HeaderDesktop v-else />

    <!-- Divider -->
    <UDivider type="dashed" />
  </header>
</template>
