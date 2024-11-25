export default defineNuxtRouteMiddleware(() => {
  // if (!useCookie('access_token').value) return navigateTo({ name: 'auth-login' });
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user.value?.type !== 'agent') return navigateTo({ name: 'index' });
});
