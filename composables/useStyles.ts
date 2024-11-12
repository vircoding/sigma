export default function useStyles() {
  return {
    textColorPrimary: 'text-azure-950 dark:text-gray-200',
    textColorSecondary: 'text-gray-500 dark:text-gray-400',
    textColorError: 'text-red-500 dark:text-red-400',
    textSizeXS: 'text-xs md:text-sm',
    textSizeSM: 'text-sm md:text-base',
    textSizeBase: 'text-base md:text-lg',
    textSizeLG: 'text-lg md:text-xl',
    textSizeXL: 'text-xl md:text-2xl',
    textSize2XL: 'text-2xl md:text-3xl',
    textSize3XL: 'text-3xl md:text-4xl',
    textSize4XL: 'text-4xl md:text-5xl',
    textSize5XL: 'text-5xl md:text-6xl',
    textSize7XL: 'text-7xl md:text-8xl',
    pageContainer: 'max-w-lg lg:max-w-full lg:px-12 xl:px-20',
    linkActiveState: `${useDevice().isMobile ? 'active:text-azure-900 dark:active:text-azure-200' : ''} ${useDevice().isDesktop ? 'hover:text-azure-900 dark:hover:text-azure-200' : 'hover:text-azure-950 dark:hover:text-gray-200'} text-azure-950 dark:text-gray-200 disabled:text-neutral-300 disabled:dark:text-neutral-700`,
  };
}
