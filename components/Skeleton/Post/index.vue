<template>
  <div class="flex flex-col">
    <!-- Gallery -->
    <div class="absolute left-[0vw] top-[72px] sm:top-[84px] md:top-24 lg:hidden">
      <USkeleton class="aspect-video w-screen" :ui="{ rounded: 'rounded-none' }" />
    </div>

    <!-- Details -->
    <div
      class="flex auto-cols-min grid-cols-2 grid-rows-1 flex-col pt-[calc(100vw/1.78)] lg:grid lg:items-center lg:gap-x-12 lg:pt-0"
    >
      <!-- Left Column (Desktop) -->
      <div>
        <!-- Desktop Gallery -->
        <USkeleton class="aspect-video w-full" :ui="{ rounded: 'rounded-xl' }" />

        <!-- Details -->
        <section class="flex h-[84px] flex-col justify-center gap-y-2 md:h-[108px] lg:h-[78px]">
          <!-- Top -->
          <div class="flex items-center justify-between">
            <div class="flex items-end gap-x-1.5">
              <USkeleton class="h-7 w-[105px] md:h-9 md:w-[118px] lg:w-[135px]" />
              <USkeleton class="h-6 w-[60px] md:h-7 md:w-16" />
            </div>

            <USkeleton class="h-8 w-8 md:h-10 md:w-10" :ui="{ rounded: 'rounded-lg' }" />
          </div>

          <!-- Mobile Address -->
          <USkeleton class="h-4 w-[250px] md:h-5 md:w-[264px] lg:hidden" />
        </section>

        <!-- Desktop Divider -->
        <UDivider type="dashed" class="mb-[22px] hidden lg:block" />

        <!-- Phone -->
        <section class="hidden h-10 gap-x-3 lg:flex">
          <USkeleton class="h-full w-full" />
          <USkeleton class="h-full w-full" />
        </section>
      </div>

      <!-- Mobile Divider -->
      <UDivider type="dashed" class="lg:hidden" />

      <div>
        <!-- Desktop Address -->
        <USkeleton class="hidden h-4 w-[250px] md:h-5 md:w-[264px] lg:block lg:h-6 lg:w-[345px]" />

        <!-- Features -->
        <section class="flex h-[172px] flex-col justify-center md:h-[204px]">
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
        <section class="flex flex-col gap-y-2 pt-[22px] md:pt-6">
          <USkeleton class="h-4 w-[225px] md:h-5 md:w-[235px] lg:w-[245px]" />
          <USkeleton class="h-4 w-[175px] md:h-5 md:w-[185px] lg:w-[195px]" />
          <USkeleton class="h-4 w-[125px] md:h-5 md:w-[135px] lg:w-[145px]" />
          <USkeleton class="h-4 w-[75px] md:h-5 md:w-[85px] lg:w-[95px]" />
          <USkeleton class="h-4 w-[100px] md:h-5 md:w-[115px] lg:hidden" />
        </section>
      </div>
    </div>
  </div>
</template>
