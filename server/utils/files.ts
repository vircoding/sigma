import fs from 'fs';
import { join } from 'path';
import type formidable from 'formidable';
import { UnexpectedError } from '~~/server/classes/Error';
import type { H3Event, EventHandlerRequest } from 'h3';
import type { File } from 'formidable';

const config = useRuntimeConfig();

export function parseMultipart(
  event: H3Event<EventHandlerRequest>,
  form: InstanceType<typeof formidable.IncomingForm>,
) {
  return new Promise<{ fields: formidable.Fields<string>; files: formidable.Files<string> }>(
    (resolve, reject) => {
      form.parse(event.node.req, (error, fields, files) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ fields, files });
      });
    },
  );
}

export function parseAvatar(avatar: File) {
  const path = join('public/uploads/avatars', `${avatar.newFilename}.jpeg`);
  const url = `${config.public.baseURL}/uploads/avatars/${avatar.newFilename}.jpeg`;

  fs.rename(avatar.filepath, path, (error) => {
    if (error) throw new UnexpectedError();
  });

  return { path, url };
}

export function parseImage(image: File) {
  const path = join('public/uploads/images', `${image.newFilename}.jpeg`);
  const url = `${config.public.baseURL}/uploads/images/${image.newFilename}.jpeg`;

  fs.rename(image.filepath, path, (error) => {
    if (error) throw new UnexpectedError();
  });

  return { path, url };
}
