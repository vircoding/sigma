<script setup lang="ts">
function onAgent() {
  console.log('Agent Event');
}
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <div class="lg:hidden">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Publicar anuncio
        </h2>
        <p>
          Completa el formulario para llegar a potenciales compradores. Si necesitas ayuda, puedes
          contactar a nuestros agentes especializados.
        </p>
      </section>
    </div>

    <FormInsert @agent="onAgent" />
  </UContainer>
</template>
