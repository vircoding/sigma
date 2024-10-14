<template>
  <UContainer class="flex gap-x-12" :class="[useStyles().container]">
    <!-- Client -->
    <NuxtLink
      :to="{ name: 'auth-register-client' }"
      class="card-shadow relative h-[350px] w-72 overflow-hidden rounded-2xl bg-cover bg-center p-0 transition-transform hover:scale-110"
      style="
        background-image: url('https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFydGlzdHxlbnwwfHwwfHx8MA%3D%3D');
      "
    >
      <div
        class="absolute inset-0 select-none"
        style="background-image: linear-gradient(transparent 0%, #1183ea 100%)"
      >
        <div class="flex h-full flex-col p-4 leading-none">
          <h3
            class="mb-2 mt-auto text-4xl font-semibold leading-none tracking-tight text-azure-50 drop-shadow-sm"
          >
            Propietario
          </h3>
          <p class="text-azure-50 drop-shadow-sm">
            Crea tu cuenta como Propietario si deseas vender o rentar tu casa.
          </p>
        </div>
      </div>
    </NuxtLink>

    <!-- Agent -->
    <NuxtLink
      :to="{ name: 'auth-register-agent' }"
      class="card-shadow relative h-[350px] w-72 overflow-hidden rounded-2xl bg-cover bg-center p-0 transition-transform hover:scale-110"
      style="
        background-image: url('https://images.unsplash.com/photo-1545209536-c79b0603d7ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGxhdWdoaW5nfGVufDB8fDB8fHww');
      "
    >
      <div
        class="absolute inset-0 select-none"
        style="background-image: linear-gradient(transparent 0%, #1c59b4 100%)"
      >
        <div class="flex h-full flex-col p-4 leading-none">
          <h3
            class="mb-2 mt-auto text-4xl font-semibold leading-none tracking-tight text-azure-50 drop-shadow-sm"
          >
            Agente
          </h3>
          <p class="text-azure-50">
            Crea tu cuenta como Agente si deseas vender o rentar más de una casa.
          </p>
        </div>
      </div>
    </NuxtLink>
  </UContainer>
</template>
