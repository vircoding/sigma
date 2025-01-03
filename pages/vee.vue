<script setup lang="ts">
function onAgent() {
  console.log('Agent Event');
}
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <VForm @agent="onAgent" />
  </UContainer>
</template>
