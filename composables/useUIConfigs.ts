export default function useUIConfigs() {
  return {
    acceptButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-primary-600 dark:active:bg-primary-500' : ''} ${useDevice().isDesktop ? 'hover:bg-primary-600 dark:hover:bg-primary-500' : 'hover:bg-primary-500 dark:hover:bg-primary-400'} bg-primary-500 dark:bg-primary-400 text-white dark:text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 disabled:bg-primary-500 aria-disabled:bg-primary-500 dark:disabled:bg-primary-400 dark:aria-disabled:bg-primary-400`,
      },
    },
    errorButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-red-600 dark:active:bg-red-500' : ''} ${useDevice().isDesktop ? 'hover:bg-red-600 dark:hover:bg-red-500' : 'hover:bg-red-500 dark:hover:bg-red-400'} bg-red-500 dark:bg-red-400 text-white dark:text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:focus-visible:outline-red-400 disabled:bg-red-500 aria-disabled:bg-red-500 dark:disabled:bg-red-400 dark:aria-disabled:bg-red-400`,
      },
    },
    cancelButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-primary-200 dark:active:bg-gray-700/60' : ''} ${useDevice().isDesktop ? 'hover:bg-primary-200 dark:hover:bg-gray-700/60' : 'hover:bg-primary-100 dark:hover:bg-gray-800'} bg-primary-100 dark:bg-gray-800 text-primary-400 dark:text-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 disabled:bg-primary-100 aria-disabled:bg-primary-100 dark:disabled:bg-gray-800 dark:aria-disabled:bg-gray-800`,
      },
    },
    blurCancelButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-primary-100 dark:active:bg-gray-800' : ''} ${useDevice().isDesktop ? 'hover:bg-primary-100 dark:hover:bg-gray-800' : 'hover:bg-primary-200 dark:hover:bg-gray-700/60'} bg-primary-200 dark:bg-gray-700/60 text-primary-400 dark:text-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 disabled:bg-primary-200 aria-disabled:bg-primary-200 dark:disabled:bg-gray-700/60 dark:aria-disabled:bg-gray-700/60`,
      },
    },
    countrySelectConfig: { wrapper: 'w-28' },
    countrySelectMenuConfig: {
      width:
        'w-[calc(100vw-64px)] min-[545px]:w-[480px] sm:w-[464px] lg:w-[calc((100vw-208px)/2)] xl:w-[488px]',
      base: 'relative',
      option: {
        base: 'cursor-pointer',
        selectedIcon: {
          base: `${useStyles().textColorPrimary}`,
        },
      },
      select: 'cursor-pointer',
      popper: {
        placement: 'bottom-start',
      },
    },
    checkboxConfig: {
      wrapper: 'relative flex items-center',
      inner: 'ms-1.5',
    },
    cropperModalConfig: { container: 'items-center' },
  };
}
