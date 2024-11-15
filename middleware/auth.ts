export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp();
  if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return;

  const sessionData = useSessionData();
  if (!sessionData.value) return navigateTo('/');
});
