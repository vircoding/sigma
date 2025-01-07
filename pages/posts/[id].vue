<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <h2>Post View</h2>
    <span>Name: {{ route.name }}</span>
    <br />
    <span>Params: {{ route.params }}</span>
    <br />
    <span>Path: {{ route.path }}</span>
  </UContainer>
</template>
