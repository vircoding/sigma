import fs from 'fs';
import { join } from 'path';
import handlebars from 'handlebars';

const DIR = 'server/templates';

export async function getVerificationEmail(verificationToken: string) {
  const file = fs.readFileSync(join(DIR, 'verificationEmail.hbs'));
  const template = handlebars.compile(file.toString());
  return template({ verificationToken });
}
