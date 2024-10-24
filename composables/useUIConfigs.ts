export default function useUIConfigs() {
  return {
    formSubmitButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-azure-600 dark:active:bg-azure-500' : ''} shadow-sm text-white dark:text-gray-900 bg-{color}-500 ${useDevice().isDesktop ? 'hover:bg-{color}-600 dark:hover:bg-{color}-500' : 'hover:bg-{color}-500 dark:hover:bg-{color}-400'} disabled:bg-{color}-500 aria-disabled:bg-{color}-500 dark:bg-{color}-400 dark:disabled:bg-{color}-400 dark:aria-disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400`,
      },
    },
    countrySelectConfig: { wrapper: 'w-28' },
    countrySelectMenuConfig: {
      width: 'w-[calc(100vw-64px)] min-[545px]:w-[480px] sm:w-[464px]',
      base: 'relative',
      option: {
        selectedIcon: {
          base: `${useStyles().textColorPrimary}`,
        },
      },
    },
    cropperModalConfig: { container: 'items-center' },
  };
}
