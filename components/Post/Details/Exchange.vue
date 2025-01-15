<script setup lang="ts">
const props = defineProps<{
  needs: number;
  offers: number;
}>();
</script>

<template>
  <aside>
    <!-- With Needs -->
    <span v-if="props.needs > 0" class="font-black" :class="[useStyles().textSize3XL]"
      >Permuta-{{ props.offers }}x{{ props.needs }}</span
    >

    <!-- Without Needs -->
    <span v-else class="font-black" :class="[useStyles().textSize3XL]"
      >{{ props.offers }}
      <span class="font-semibold" :class="[useStyles().textSize2XL]">{{
        props.offers > 1 ? 'propiedades' : 'propiedad'
      }}</span></span
    >
  </aside>
</template>
