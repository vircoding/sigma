import mitt from 'mitt';
import type { PostType } from '~/models/PostTypes';

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
