import mitt from 'mitt';
import type { PostType } from '~/models/types/Post';

type ApplicationEvents = {
  'navigation:insert': PostType;
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>();

  return {
    provide: {
      event: emitter.emit,
      listen: emitter.on,
    },
  };
});
