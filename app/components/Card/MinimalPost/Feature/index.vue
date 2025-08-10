<script setup lang="ts">
const props = defineProps<{
  features: Features;
  color: string;
  gapCompress: boolean;
}>();
</script>

<template>
  <section
    class="grid grid-cols-3 grid-rows-2 gap-x-3 gap-y-1.5"
    :class="{ 'md:gap-y-3': !props.gapCompress }"
  >
    <!-- Bed -->
    <CardMinimalPostFeatureNumeric
      :count="props.features.bed"
      :color="props.color"
      class="col-start-1 row-start-1"
    >
      <template #icon>
        <IconFeatureBed />
      </template>
    </CardMinimalPostFeatureNumeric>

    <!-- Bath -->
    <CardMinimalPostFeatureNumeric
      :count="props.features.bath"
      :color="props.color"
      class="col-start-2 row-start-1"
    >
      <template #icon>
        <IconFeatureBath />
      </template>
    </CardMinimalPostFeatureNumeric>

    <!-- Backyard -->
    <CardMinimalPostFeatureBoolean
      :state="props.features.backyard"
      :color="props.color"
      class="col-start-1 row-start-2"
    >
      <template #icon>
        <IconFeatureBackyard />
      </template>
    </CardMinimalPostFeatureBoolean>

    <!-- Balcony -->
    <CardMinimalPostFeatureBoolean
      :state="props.features.balcony"
      :color="props.color"
      class="col-start-3 row-start-2"
    >
      <template #icon>
        <IconFeatureBalcony />
      </template>
    </CardMinimalPostFeatureBoolean>

    <!-- Garage -->
    <CardMinimalPostFeatureBoolean
      :state="props.features.garage"
      :color="props.color"
      class="col-start-3 row-start-1"
    >
      <template #icon>
        <IconFeatureGarage />
      </template>
    </CardMinimalPostFeatureBoolean>

    <!-- Pool -->
    <CardMinimalPostFeatureBoolean
      :state="props.features.pool"
      :color="props.color"
      class="col-start-2 row-start-2"
    >
      <template #icon>
        <IconFeaturePool />
      </template>
    </CardMinimalPostFeatureBoolean>
  </section>
</template>
