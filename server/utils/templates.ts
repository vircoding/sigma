import fs from 'fs';
import { join } from 'path';
import handlebars from 'handlebars';

const DIR = 'server/templates';

export async function getVerificationEmail(verificationToken: string) {
  const file = fs.readFileSync(join(DIR, 'verificationEmail.hbs'));
  const template = handlebars.compile(file.toString());
  return template({ verificationToken });
}

export async function getVerificationSuccess() {
  const file = fs.readFileSync(join(DIR, 'verificationSuccess.hbs'));
  const template = handlebars.compile(file.toString());
  return template({});
}

export async function getVerificationIsVerified() {
  const file = fs.readFileSync(join(DIR, 'verificationIsVerified.hbs'));
  const template = handlebars.compile(file.toString());
  return template({});
}

export async function getVerificationFailed() {
  const file = fs.readFileSync(join(DIR, 'verificationFailed.hbs'));
  const template = handlebars.compile(file.toString());
  return template({});
}

export async function getPasswordEmail(passwordCode: string) {
  const file = fs.readFileSync(join(DIR, 'passwordEmail.hbs'));
  const template = handlebars.compile(file.toString());
  return template({ passwordCode });
}
