<script setup lang="ts">
const props = defineProps<{
  features: Features;
  color: string;
  gapCompress: boolean;
}>();
</script>

<template>
  <section
    class="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-3"
    :class="{ 'md:gap-y-3': !props.gapCompress }"
  >
    <!-- Bed -->
    <CardFullPostFeatureNumeric
      :count="props.features.bed"
      :color="props.color"
      class="col-start-1 row-start-1"
    >
      <template #icon>
        <IconFeatureBed />
      </template>
    </CardFullPostFeatureNumeric>

    <!-- Bath -->
    <CardFullPostFeatureNumeric
      :count="props.features.bath"
      :color="props.color"
      class="col-start-2 row-start-1"
    >
      <template #icon>
        <IconFeatureBath />
      </template>
    </CardFullPostFeatureNumeric>

    <!-- Backyard -->
    <CardFullPostFeatureBoolean
      :state="props.features.backyard"
      :color="props.color"
      class="col-start-1 row-start-2"
    >
      <template #icon>
        <IconFeatureBackyard />
      </template>
    </CardFullPostFeatureBoolean>

    <!-- Balcony -->
    <CardFullPostFeatureBoolean
      :state="props.features.balcony"
      :color="props.color"
      class="col-start-3 row-start-2"
    >
      <template #icon>
        <IconFeatureBalcony />
      </template>
    </CardFullPostFeatureBoolean>

    <!-- Garage -->
    <CardFullPostFeatureBoolean
      :state="props.features.garage"
      :color="props.color"
      class="col-start-3 row-start-1"
    >
      <template #icon>
        <IconFeatureGarage />
      </template>
    </CardFullPostFeatureBoolean>

    <!-- Pool -->
    <CardFullPostFeatureBoolean
      :state="props.features.pool"
      :color="props.color"
      class="col-start-2 row-start-2"
    >
      <template #icon>
        <IconFeaturePool />
      </template>
    </CardFullPostFeatureBoolean>
  </section>
</template>
