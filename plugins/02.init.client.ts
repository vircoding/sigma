import { FetchError } from 'ofetch';

export default defineNuxtPlugin(async () => {
  const accessToken = useCookie('access_token');
  if (accessToken.value) {
    try {
      const data = await $fetch('/api/auth/refresh', { method: 'POST' });

      accessToken.value = data.access_token;
    } catch (error) {
      accessToken.value = null;

      if (error instanceof FetchError) {
        if (error.statusCode === 401 && error.data.message === 'The refresh token has expired')
          return;
        if (error.status === 400 && error.data.message === 'Invalid or missing refresh token') {
          return;
        }
      }
      showError(createError({ status: 500 }));
    }
  }
});
