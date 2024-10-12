<template>
  <div
    class="bg-lbackground font-quicksand dark:bg-dbackground"
    :class="[useStyles().textColorSecondary, useStyles().textSizeBase]"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
