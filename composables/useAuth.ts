import { FetchError } from 'ofetch';
import {
  FormFieldError,
  BadRequestError,
  ConflictError,
  FatalError,
  MaxSizeError,
  NotFoundError,
  BadCredentialsError,
} from '~/models/Error';
import type { RegisterClientSchema, RegisterAgentSchema } from '~/models/ValSchema';

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
      if (error.statusCode === 409) throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError('Unexpected error');
  }
}

async function registerAgent(
  body: Omit<RegisterAgentSchema, 'code' | 'avatar'> & {
    avatar?: Blob;
  },
) {
  try {
    const formData = new FormData();
    formData.append('input', JSON.stringify({ type: 'agent', ...body }));
    if (body.avatar) formData.append('avatar', body.avatar);

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 409) throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        if (error.data.message === 'File exceeds the maximum allowed size of 5MB')
          throw new MaxSizeError(error.message);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError('Unexpected error');
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
      if (error.statusCode === 404) throw new NotFoundError(error.message);
      if (error.statusCode === 409) throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError('Unexpected error');
  }
}

async function login(body: { email: string; password: string }) {
  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body });
    useSessionData().value = { accessToken: data.access_token };
    useUserData().value = data.user;
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401) throw new BadCredentialsError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError('Unexpected error');
  }
}

export default function () {
  return { registerClient, registerAgent, resendVerificationEmail, login };
}
