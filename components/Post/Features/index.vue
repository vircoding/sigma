<script setup lang="ts">
import type { Features } from '~/server/models/Types';

const props = defineProps<{
  features: Features;
}>();
</script>

<template>
  <section class="grid grid-cols-4 grid-rows-2 gap-y-2 pb-5 pt-3 md:pb-7 md:pt-5 lg:pt-1">
    <!-- Bed -->
    <PostFeaturesNumeric
      label="Cuartos"
      :count="props.features.bed"
      class="col-start-1 row-start-1"
    >
      <template #icon>
        <IconFeatureBed />
      </template>
    </PostFeaturesNumeric>

    <!-- Bath -->
    <PostFeaturesNumeric label="Baños" :count="props.features.bath" class="col-start-2 row-start-1">
      <template #icon>
        <IconFeatureBath />
      </template>
    </PostFeaturesNumeric>

    <!-- Garage -->
    <PostFeaturesBoolean
      label="Garage"
      :state="props.features.garage"
      class="col-start-3 row-start-1"
    >
      <template #icon>
        <IconFeatureGarage />
      </template>
    </PostFeaturesBoolean>

    <!-- Garden -->
    <PostFeaturesBoolean
      label="Jardín"
      :state="props.features.garden"
      class="col-start-1 row-start-2"
    >
      <template #icon>
        <IconFeatureGarden />
      </template>
    </PostFeaturesBoolean>

    <!-- Pool -->
    <PostFeaturesBoolean
      label="Piscina"
      :state="props.features.pool"
      class="col-start-2 row-start-2"
    >
      <template #icon>
        <IconFeaturePool />
      </template>
    </PostFeaturesBoolean>

    <!-- Furnished -->
    <PostFeaturesBoolean
      label="Amueblada"
      :state="props.features.furnished"
      class="col-start-3 row-start-2"
    >
      <template #icon>
        <IconFeatureFurnished />
      </template>
    </PostFeaturesBoolean>
  </section>
</template>
