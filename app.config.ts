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
      color: { white: { outline: 'text-gray-500 dark:text-gray-400' } },
      variant: { outline: 'text-gray-500 dark:text-gray-400' },
    },
    button: {
      rounded: 'rounded-xl',
      size: { md: 'text-base md:text-lg' },
      padding: { md: 'py-1.5' },
    },
    divider: {
      border: { base: 'border-gray-300 dark:border-gray-700' },
    },
  },
});
