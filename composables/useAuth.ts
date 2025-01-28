import { FetchError } from 'ofetch';
import type {
  RegisterClientSchema,
  RegisterAgentSchema,
} from '~/models/schemas/client/RegisterSchema';
import {
  FormFieldError,
  BadRequestError,
  ConflictError,
  FatalError,
  MaxSizeError,
  NotFoundError,
  BadCredentialsError,
  RefreshTokenExpiredError,
  InvalidRefreshTokenError,
  ResetPasswordError,
} from '~/models/classes/client/Error';
import type { LoginSchema } from '~/models/schemas/client/LoginSchema';

async function registerClient(body: RegisterClientSchema) {
  try {
    const formData = new FormData();
    formData.append('input', JSON.stringify({ type: 'client', ...body }));

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 409 && error.data.message === 'User exists already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function registerAgent(body: RegisterAgentSchema) {
  try {
    const formData = new FormData();
    formData.append(
      'input',
      JSON.stringify({
        type: 'agent',
        email: body.email,
        password: body.password,
        repassword: body.repassword,
        firstname: body.firstname,
        lastname: body.lastname,
        bio: body.bio,
        phone: `+${body.phone.code}${body.phone.phone}`,
      }),
    );
    formData.append('avatar', body.avatar);

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 409 && error.data.message === 'User exists already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        if (error.data.message === 'File exceeds the maximum allowed size of 5MB')
          throw new MaxSizeError(error.message);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function resendVerificationEmail(email: string) {
  try {
    await $fetch('/api/auth/verify/resend', {
      method: 'POST',
      body: { email },
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 404 && error.data.message === 'User not found')
        throw new NotFoundError(error.message);
      if (error.statusCode === 409 && error.data.message === 'This account is verified already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function login(body: LoginSchema) {
  const userStore = useUserStore();

  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body });
    const accessToken = useCookie('access_token');
    accessToken.value = data.access_token;
    userStore.setUser(data.user);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'Bad credentials')
        throw new BadCredentialsError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function refresh() {
  try {
    const data = await $fetch('/api/auth/refresh', { method: 'POST' });
    useCookie('access_token').value = data.access_token;
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The refresh token has expired')
        throw new RefreshTokenExpiredError(error.message);
      if (error.status === 400 && error.data.message === 'Invalid or missing refresh token') {
        throw new InvalidRefreshTokenError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function logout() {
  const userStore = useUserStore();

  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    useCookie('access_token').value = null;
    userStore.$reset();
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The refresh token has expired') {
        useCookie('access_token').value = null;
        userStore.$reset();

        throw new RefreshTokenExpiredError(error.message);
      }
      if (error.status === 400 && error.data.message === 'Invalid or missing refresh token') {
        useCookie('access_token').value = null;
        userStore.$reset();

        throw new InvalidRefreshTokenError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function postResetPassword(body: { email: string }) {
  try {
    await $fetch('/api/auth/password', {
      method: 'POST',
      body,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function putResetPassword(body: { email: string; code: string }) {
  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'Code validation fails')
        throw new ResetPasswordError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function patchResetPassword(body: { email: string; password: string; repassword: string }) {
  const userStore = useUserStore();

  try {
    const data = await $fetch('/api/auth/password', {
      method: 'PATCH',
      body,
    });

    const accessToken = useCookie('access_token');
    accessToken.value = data.access_token;
    userStore.setUser(data.user);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'Unable to reset the password')
        throw new ResetPasswordError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

export default function () {
  return {
    registerClient,
    registerAgent,
    resendVerificationEmail,
    login,
    refresh,
    logout,
    postResetPassword,
    putResetPassword,
    patchResetPassword,
  };
}
