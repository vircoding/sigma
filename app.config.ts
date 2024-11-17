export default defineAppConfig({
  ui: {
    primary: 'azure',
    gray: 'neutral',
    formGroup: {
      label: { base: 'ml-2 leading-none font-medium text-azure-950 dark:text-gray-200' },
      size: { md: 'text-base md:text-lg' },
      error: 'ml-1.5 mt-0',
    },
    input: {
      rounded: 'rounded-xl',
      size: { md: 'text-base md:text-lg' },
      padding: { md: 'py-1.5' },
      icon: {
        size: { md: 'h-5 w-5 md:h-6 md:w-6' },
        trailing: { pointer: 'pointer-events-auto' },
      },
      color: { white: { outline: 'text-azure-950 dark:text-gray-200' } },
      variant: { outline: 'text-azure-950 dark:text-gray-200' },
    },
    textarea: {
      rounded: 'rounded-xl',
      size: { md: 'text-base md:text-lg' },
      padding: { md: 'py-1.5' },
      color: { white: { outline: 'text-azure-950 dark:text-gray-200' } },
      variant: { outline: 'text-azure-950 dark:text-gray-200' },
    },
    select: {
      rounded: 'rounded-xl',
      size: { md: 'text-base md:text-lg' },
      padding: { md: 'py-1.5' },
      color: { white: { outline: 'text-azure-950 dark:text-gray-200' } },
      variant: { outline: 'text-azure-950 dark:text-gray-200' },
    },
    selectMenu: {
      input: 'text-base md:text-lg',
      option: { size: 'text-base md:text-lg' },
      rounded: 'rounded-xl',
    },
    button: {
      rounded: 'rounded-xl',
      size: { md: 'text-base md:text-lg' },
      padding: { md: 'py-1.5' },
    },
    divider: {
      border: { base: 'border-gray-300 dark:border-gray-700' },
    },
    modal: {
      rounded: 'rounded-xl',
    },
    dropdown: {
      container: 'z-20',
      background: 'bg-white dark:bg-gray-900',
      item: {
        active: 'bg-white dark:bg-gray-900',
        base: 'hover:bg-gray-100 hover:dark:bg-gray-800 group/item',
      },
    },
  },
});
