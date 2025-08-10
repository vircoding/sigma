import { VerificationTokenError, VerifiedError } from '~~/server/classes/Error';
import {
  decodedVerificationTokenSchema,
  verificationTokenSchema,
} from '~~/server/schemas/GlobalSchema';

export default defineEventHandler(async (event) => {
  try {
    // Get the verification token
    let { verificationToken } = getRouterParams(event);

    // Validate the verification token
    verificationToken = await verificationTokenSchema.parseAsync(verificationToken);

    // Decode the verification token
    const payload = decodeVerificationToken(verificationToken);
    if (!payload) throw new VerificationTokenError('Invalid verification token');

    // Validate the decoded verification token
    const decodedVerificationToken = await decodedVerificationTokenSchema.parseAsync(payload);

    // Verify the user
    await verifyUser(decodedVerificationToken.userId, decodedVerificationToken.code);

    // Get the verification success content
    const verificationSuccessContent = await getVerificationSuccess().catch(() => {
      return {
        status: 'Éxito',
        message: 'Hola. Tu cuenta ha sido verificada exitosamente! Ya puedes cerrar esta pestaña.',
      };
    });

    // Success response
    return verificationSuccessContent;
  } catch (error) {
    // Verified Error Handler
    if (error instanceof VerifiedError) {
      // Get the response content
      const verificationIsVerifiedContent = await getVerificationIsVerified().catch(() => {
        return {
          status: 'Error',
          message:
            'Lo sentimos! Es imposible verificar tu cuenta debido a que esta ya ha sido verificada.',
        };
      });

      return verificationIsVerifiedContent;
    }

    // Get the verification failed content
    const verificationFailedContent = await getVerificationFailed().catch(() => {
      return {
        status: 'Error',
        message:
          'Lo sentimos! Es imposible verificar tu cuenta. Intenta solicitar un nuevo correo de verificación y si el problema persiste, por favor, espera unos minutos e inténtalo más tarde.',
      };
    });

    // Failed response
    return verificationFailedContent;
  }
});
