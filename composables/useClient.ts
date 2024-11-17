async function initAuth() {
  const agentAuthRoutes: string[] = ['update-agent'];
  const authRoutes: string[] = ['insert'];
  const noAuthRoutes: string[] = [
    'auth-register',
    'auth-register-client',
    'auth-register-agent',
    'auth-login',
  ];

  const currentPath = useRoute().name?.toString();
  if (!currentPath) return showError(createError({ status: 500 }));

  const sessionData = useSessionData();

  if (noAuthRoutes.includes(currentPath)) {
    if (sessionData.value) return await navigateTo({ name: 'index' });
  } else if (authRoutes.includes(currentPath)) {
    if (!sessionData.value) return await navigateTo({ name: 'auth-login' });
  } else if (agentAuthRoutes.includes(currentPath)) {
    const userData = useUserData();
    if (!sessionData.value || userData.value?.type !== 'agent')
      return await navigateTo({ name: 'index' });
  }
}

export default function () {
  return { initAuth };
}
