<template>
  <header>
    <!-- Mobile -->
    <HeaderMobile v-if="$device.isMobileOrTablet" :is-logged-in="!!useSessionData().value" />

    <!-- Desktop -->
    <HeaderDesktop v-else :is-logged-in="!!useSessionData().value" />

    <!-- Divider -->
    <UDivider type="dashed" />
  </header>
</template>
