<template>
  <div class="flex flex-col">
    <!-- Gallery -->
    <div class="absolute left-[0vw] top-[72px] sm:top-[84px]">
      <USkeleton class="aspect-video w-screen" :ui="{ rounded: 'rounded-none' }" />
    </div>

    <!-- Details -->
    <div class="flex flex-col pt-[calc(100vw/1.78)]">
      <!-- Hero -->
      <section class="flex h-[84px] flex-col justify-center gap-3">
        <!-- Top -->
        <div class="flex items-center justify-between">
          <div class="flex items-end gap-x-1.5">
            <USkeleton class="h-7 w-[105px]" />
            <USkeleton class="h-6 w-[60px]" />
          </div>

          <USkeleton class="h-7 w-7" :ui="{ rounded: 'rounded-lg' }" />
        </div>

        <!-- Address -->
        <USkeleton class="h-4 w-[250px]" />
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Features -->
      <section class="flex h-[172px] flex-col justify-center">
        <div class="grid grid-cols-4 grid-rows-2 gap-y-4">
          <SkeletonPostFeature class="col-start-1 row-start-1" />
          <SkeletonPostFeature class="col-start-2 row-start-1" />
          <SkeletonPostFeature class="col-start-3 row-start-1" />
          <SkeletonPostFeature class="col-start-1 row-start-2" />
          <SkeletonPostFeature class="col-start-2 row-start-2" />
          <SkeletonPostFeature class="col-start-3 row-start-2" />
        </div>
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Description -->
      <section class="flex flex-col gap-y-1 py-4">
        <USkeleton class="h-4 w-[225px]" />
        <USkeleton class="h-4 w-[175px]" />
        <USkeleton class="h-4 w-[125px]" />
        <USkeleton class="h-4 w-[75px]" />
        <USkeleton class="h-4 w-[100px]" />
      </section>
    </div>
  </div>
</template>
