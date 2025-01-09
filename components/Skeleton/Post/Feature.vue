<template>
  <div class="flex flex-col gap-y-1.5">
    <USkeleton class="h-4 w-[55px]" />

    <div class="flex items-center gap-x-1">
      <USkeleton class="h-9 w-9" />
      <USkeleton class="h-6 w-[25px]" :ui="{ rounded: 'rounded-lg' }" />
    </div>
  </div>
</template>
