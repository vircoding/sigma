<script setup lang="ts">
const props = defineProps<{
  property: Property;
}>();
</script>

<template>
  <div>
    <!-- Address -->
    <aside class="pb-3 md:pb-5 lg:pb-1">
      <span class="lg:text-2xl lg:font-bold lg:text-azure-950 lg:dark:text-gray-200"
        >{{ props.property.address.municipality }}, {{ props.property.address.province }}</span
      >
    </aside>

    <!-- Mobile Divider -->
    <UDivider type="dashed" class="lg:hidden" />

    <!-- Features -->
    <PostFeatures :features="props.property.features" />

    <!-- Mobile Divider -->
    <UDivider type="dashed" class="lg:hidden" />
  </div>
</template>
