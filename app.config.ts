export default defineAppConfig({
  ui: {
    primary: 'azure',
    gray: 'neutral',
    formGroup: {
      label: { base: 'ml-2 leading-none font-medium text-azure-950 dark:text-gray-200' },
      size: { md: 'text-base' },
      error: 'ml-1.5 mt-0',
    },
    input: {
      rounded: 'rounded-xl',
      size: { md: 'text-base' },
      padding: { md: 'py-1.5' },
      icon: {
        trailing: { pointer: 'pointer-events-auto' },
      },
      color: { white: { outline: 'text-gray-500 dark:text-gray-400' } },
    },
    button: {
      rounded: 'rounded-xl',
      size: { md: 'text-base' },
      padding: { md: 'py-1.5' },
    },
  },
});
