import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: useRuntimeConfig().nodemailerHost,
  port: 465,
  secure: true,
  auth: {
    user: useRuntimeConfig().nodemailerUser,
    pass: useRuntimeConfig().nodemailerPassword,
  },
});

export function sendVerificationEmail(email: string, content: string) {
  return transporter.sendMail({
    from: `Sigma <${useRuntimeConfig().nodemailerUser}>`,
    to: email,
    subject: 'Complete your account verification',
    html: content,
  });
}

export function sendPasswordEmail(email: string, content: string) {
  return transporter.sendMail({
    from: `Sigma <${useRuntimeConfig().nodemailerUser}>`,
    to: email,
    subject: 'Password reset',
    html: content,
  });
}
