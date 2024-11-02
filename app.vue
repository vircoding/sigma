<template>
  <div class="font-quicksand" :class="[useStyles().textColorSecondary, useStyles().textSizeBase]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UModals />
  </div>
</template>

<style>
html ::-webkit-scrollbar {
  position: absolute;
  width: 8px;
}

html ::-webkit-scrollbar-track {
  background: #f5f5f5;
}

html ::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 5px;
}

html ::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

html.dark ::-webkit-scrollbar-track {
  background: #262626;
}

html.dark ::-webkit-scrollbar-thumb {
  background: #404040;
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #525252;
}
</style>
