import { FetchError } from 'ofetch';
import { FormFieldError, BadRequestError, ConflictError, FatalError } from '~/models/Error';
import type { RegisterClientSchema } from '~/schemas/register';

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
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        else throw new BadRequestError(error.message);
      }
      if (error.statusCode === 409) throw new ConflictError(error.message);
    }
    throw new FatalError('Unexpected error');
  }
}

// async function registerAgent(body: RegisterAgentSchema) {
//   try {
//     const formData = new FormData();
//     formData.append('input', JSON.stringify({ type: 'agent', ...body }));

//     await $fetch('/api/auth/register', {
//       method: 'POST',
//       body: formData,
//     });
//   } catch (error) {
//     if (error instanceof FetchError && 'message' in error.data && 'data' in error.data) {
//       if (error.status === 400 && error.data.message === 'Invalid or missing required parameters') {
//         throw new FormFieldError(error.message, error.data.data);
//       }
//       if (error.statusCode === 409) throw new ConflictError(error.message);
//     }
//     throw new FatalError('Unexpected error');
//   }
// }

export default function () {
  return { registerClient };
}
