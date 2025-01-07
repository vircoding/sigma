export default defineNuxtRouteMiddleware(() => {
  const { abortNavigate } = useGlobalStore();

  if (!abortNavigate) abortNavigation();
});
