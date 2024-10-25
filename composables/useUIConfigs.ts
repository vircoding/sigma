export default function useUIConfigs() {
  return {
    formSubmitButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-azure-600 dark:active:bg-azure-500' : ''} shadow-sm text-white dark:text-gray-900 bg-{color}-500 dark:bg-{color}-400 ${useDevice().isDesktop ? 'hover:bg-{color}-600 dark:hover:bg-{color}-500' : 'hover:bg-{color}-500 dark:hover:bg-{color}-400'} disabled:bg-{color}-500 aria-disabled:bg-{color}-500 dark:disabled:bg-{color}-400 dark:aria-disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400`,
      },
    },
    acceptButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-azure-600 dark:active:bg-azure-500' : ''} ${useDevice().isDesktop ? 'hover:bg-azure-600 dark:hover:bg-azure-500' : 'hover:bg-azure-500 dark:hover:bg-azure-400'} bg-azure-500 dark:bg-azure-400 text-white dark:text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-500 dark:focus-visible:outline-azure-400`,
      },
    },
    cancelButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-azure-200 dark:active:bg-gray-700/50' : ''} ${useDevice().isDesktop ? 'hover:bg-azure-200 dark:hover:bg-gray-700/50' : 'hover:bg-azure-100 dark:hover:bg-gray-800'} bg-azure-100 dark:bg-gray-800 text-azure-400 dark:text-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-500 dark:focus-visible:outline-azure-400`,
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
    cropperModalConfig: { container: 'items-center' },
  };
}
