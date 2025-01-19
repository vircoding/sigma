<template>
  <div class="flex flex-col gap-y-1.5">
    <USkeleton class="h-4 w-[55px] md:h-5 md:w-[75px]" />

    <div class="flex items-center gap-x-1.5 md:gap-x-2">
      <USkeleton class="h-9 w-9 md:h-11 md:w-11" />
      <USkeleton class="h-6 w-[22px] md:h-7 md:w-[26px]" :ui="{ rounded: 'rounded-lg' }" />
    </div>
  </div>
</template>
