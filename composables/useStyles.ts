export default function useStyles() {
  return {
    textColorPrimary: 'text-azure-950 dark:text-gray-200',
    textColorSecondary: 'text-gray-500 dark:text-gray-400',
    textSizeXS: 'text-xs md:text-sm',
    textSizeSM: 'text-sm md:text-base',
    textSizeBase: 'text-base md:text-lg',
    textSizeLG: 'text-lg md:text-xl',
    textSize3XL: 'text-3xl md:text-4xl',
    textSize4XL: 'text-4xl md:text-5xl',
    pageContainer: 'max-w-lg lg:max-w-full lg:px-12 xl:px-20',
    formSubmitButtonConfig: {
      variant: {
        solid: `${useDevice().isMobile ? 'active:bg-azure-600 dark:active:bg-azure-500' : ''} shadow-sm text-white dark:text-gray-900 bg-{color}-500 ${useDevice().isDesktop ? 'hover:bg-{color}-600 dark:hover:bg-{color}-500' : 'hover:bg-{color}-500 dark:hover:bg-{color}-400'} disabled:bg-{color}-500 aria-disabled:bg-{color}-500 dark:bg-{color}-400 dark:disabled:bg-{color}-400 dark:aria-disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400`,
      },
    },
  };
}
