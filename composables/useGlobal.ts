import { ModalLoadingAnimation } from '#components';

const modals = useModal();

function openSubmitLoading() {
  const { setAbortNavigate } = useGlobalStore();

  setAbortNavigate(true);
  modals.open(ModalLoadingAnimation);
}

async function closeSubmitLoading() {
  const { setAbortNavigate } = useGlobalStore();

  await modals.close();
  setAbortNavigate(false);
}

export default function () {
  return { openSubmitLoading, closeSubmitLoading };
}
