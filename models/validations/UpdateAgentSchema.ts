import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';

// Types
export type UpdateAgentSchema = z.output<typeof updateAgentSchema>;

// Update Agent
export const updateAgentSchema = z
  .object({
    firstname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Este nombre no es válido',
      }),
    lastname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Los apellidos no son válidos',
      }),
    code: z
      .string({ message: 'Requerido' })
      .trim()
      .refine(
        (data) => {
          const regex = /^\+\d+$/;
          if (data.length > 3) return false;
          if (!regex.test(`+${data}`)) return false;
          return true;
        },
        { message: 'El código no es válido' },
      ),
    phone: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
    bio: z
      .string({ message: 'La biografía no es válida' })
      .trim()
      .max(250, 'No puede exceder de 250 caracteres')
      .optional(),
  })
  .refine(
    (data) => {
      const parsedPhoneNumber = parsePhoneNumber(`+${data.code}${data.phone}`);
      if (!parsedPhoneNumber?.isValid()) return false;
      else return true;
    },
    {
      message: 'Debe ser un teléfono válido',
      path: ['phone'],
    },
  );
