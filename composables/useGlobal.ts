import type { PostType } from '~/models/types/Post';
import { ModalLoadingAnimation } from '#components';

function openSubmitLoading() {
  const modals = useModal();
  const { setAbortNavigate } = useGlobalStore();

  setAbortNavigate(true);
  modals.open(ModalLoadingAnimation);
}

function setUIPrimary(type: PostType) {
  const appConfig = useAppConfig();

  switch (type) {
    case 'rent':
      appConfig.ui.primary = 'keppel';
      break;
    case 'exchange':
      appConfig.ui.primary = 'affair';
      break;
    default:
      appConfig.ui.primary = 'azure';
      break;
  }
}

function resetUIPrimary() {
  const appConfig = useAppConfig();
  appConfig.ui.primary = 'azure';
}

async function closeSubmitLoading() {
  const modals = useModal();
  const { setAbortNavigate } = useGlobalStore();

  await modals.close();
  setAbortNavigate(false);
}

export default function () {
  return { openSubmitLoading, closeSubmitLoading, setUIPrimary, resetUIPrimary };
}
