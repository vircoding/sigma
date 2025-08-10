<script setup lang="ts">
definePageMeta({
  middleware: 'no-auth',
});
</script>

<template>
  <UContainer
    class="items-center gap-x-6 gap-y-10 lg:flex lg:flex-row min-[1154px]:gap-x-12"
    :class="[useStyles().pageContainer]"
  >
    <!-- Hero -->
    <section class="mb-7 flex shrink-0 flex-col gap-2 lg:mb-0 lg:w-[36%] min-[1154px]:w-1/3">
      <h2
        class="font-ubuntu font-bold"
        :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
      >
        ¿Cómo deseas registrarte?
      </h2>
      <p>
        Escoge el tipo de cuenta que se acomode a tus necesidades. Puedes cambiar tu decisión en
        cualquier momento.
      </p>
    </section>

    <section
      class="flex grow flex-col items-center justify-center gap-y-7 lg:flex-row lg:gap-x-5 min-[1154px]:gap-x-10"
    >
      <!-- Client -->
      <NuxtLink
        :to="{ name: 'auth-register-client' }"
        class="card-background-client relative h-[250px] w-full overflow-hidden rounded-2xl bg-cover bg-top text-azure-50 transition-transform lg:h-[350px] lg:min-w-64 min-[1154px]:min-w-72"
        :class="{ 'hover:scale-110': $device.isDesktop }"
      >
        <div
          class="absolute inset-0 select-none"
          style="background-image: linear-gradient(transparent 0%, #1183ea 100%)"
        >
          <div class="flex h-full flex-col px-4 py-6 leading-none">
            <h3
              class="mb-2 mt-auto font-ubuntu font-semibold leading-none tracking-tight drop-shadow-sm"
              :class="[useStyles().textSize3XL]"
            >
              Propietario
            </h3>
            <p class="drop-shadow-sm">
              Crea tu cuenta como Propietario si deseas vender o rentar tu casa.
            </p>
          </div>
        </div>
      </NuxtLink>

      <!-- Agent -->
      <NuxtLink
        :to="{ name: 'auth-register-agent' }"
        class="card-background-agent relative h-[250px] w-full overflow-hidden rounded-2xl bg-cover bg-top text-azure-50 transition-transform lg:h-[350px] lg:min-w-64 min-[1154px]:min-w-72"
        :class="{ 'hover:scale-110': $device.isDesktop }"
      >
        <div
          class="absolute inset-0 select-none"
          style="background-image: linear-gradient(transparent 0%, #1c59b4 100%)"
        >
          <div class="flex h-full flex-col px-4 py-6 leading-none">
            <h3
              class="mb-2 mt-auto font-ubuntu font-semibold leading-none tracking-tight drop-shadow-sm"
              :class="[useStyles().textSize3XL]"
            >
              Agente
            </h3>
            <p class="drop-shadow-sm">
              Crea tu cuenta como Agente si deseas vender o rentar más de una casa.
            </p>
          </div>
        </div>
      </NuxtLink>
    </section>
  </UContainer>
</template>

<style lang="css" scoped>
.card-background-client {
  background-image: url('~/assets/images/register-card-client.avif');
}

.card-background-agent {
  background-image: url('~/assets/images/register-card-agent.avif');
}
</style>
