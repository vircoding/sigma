export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user.value?.type !== 'agent') return navigateTo({ name: 'index' });
});
