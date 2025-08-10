export default defineNuxtRouteMiddleware(() => {
  const { preventNavigate } = useUIStore();

  if (preventNavigate) abortNavigation();
});
