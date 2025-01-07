export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();

  const accessToken = useCookie('access_token');

  if (accessToken.value) {
    await $fetch('/api/auth', {
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
      },
    })
      .then((data) => {
        userStore.setUser(data.user);
      })
      .catch(() => {
        showError(createError({ status: 500 }));
      });
  }
});
