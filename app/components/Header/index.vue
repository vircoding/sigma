<template>
  <header>
    <!-- Mobile -->
    <HeaderMobile
      v-if="$device.isMobileOrTablet"
      :is-logged-in="!!useCookie('access_token').value"
    />

    <!-- Desktop -->
    <HeaderDesktop v-else :is-logged-in="!!useCookie('access_token').value" />

    <!-- Divider -->
    <UDivider type="dashed" />
  </header>
</template>
