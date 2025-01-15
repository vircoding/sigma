import { ModalLoadingAnimation } from '#components';

function openSubmitLoading() {
  const modals = useModal();
  const { setAbortNavigate } = useGlobalStore();

  setAbortNavigate(true);
  modals.open(ModalLoadingAnimation);
}

async function closeSubmitLoading() {
  const modals = useModal();
  const { setAbortNavigate } = useGlobalStore();

  await modals.close();
  setAbortNavigate(false);
}

export default function () {
  return { openSubmitLoading, closeSubmitLoading };
}
