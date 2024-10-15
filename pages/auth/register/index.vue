<template>
  <UContainer
    class="items-center gap-x-12 gap-y-10 lg:flex lg:flex-row"
    :class="[useStyles().pageContainer]"
  >
    <!-- Hero -->
    <section class="mb-7 flex flex-col gap-2 lg:mb-0 lg:w-1/3">
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

    <section class="flex grow flex-col items-center justify-center gap-x-10 gap-y-7 lg:flex-row">
      <!-- Client -->
      <NuxtLink
        :to="{ name: 'auth-register-client' }"
        class="card-shadow relative h-[250px] w-full overflow-hidden rounded-2xl bg-cover bg-center p-0 text-azure-50 transition-transform lg:h-[350px] lg:w-72"
        :class="{ 'hover:scale-110': $device.isDesktop }"
        style="
          background-image: url('https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFydGlzdHxlbnwwfHwwfHx8MA%3D%3D');
          background-position: top;
        "
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
        class="card-shadow relative h-[250px] w-full overflow-hidden rounded-2xl bg-cover bg-center p-0 text-azure-50 transition-transform lg:h-[350px] lg:w-72"
        :class="{ 'hover:scale-110': $device.isDesktop }"
        style="
          background-image: url('https://images.unsplash.com/photo-1545209536-c79b0603d7ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGxhdWdoaW5nfGVufDB8fDB8fHww');
          background-position: top;
        "
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
