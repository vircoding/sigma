import fs from 'fs';
import path from 'path';

export default defineNitroPlugin(() => {
  const avatarsPath = path.resolve('public/uploads/avatars');
  if (!fs.existsSync(avatarsPath)) fs.mkdirSync(avatarsPath, { recursive: true });

  const imagesPath = path.resolve('public/uploads/images');
  if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath, { recursive: true });
});
