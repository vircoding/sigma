export default defineNuxtRouteMiddleware(() => {
  if (useCookie('access_token').value) return navigateTo({ name: 'index' });
});
