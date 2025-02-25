// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    jwtVerificationSecret: process.env.JWT_VERIFICATION_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    nodemailerHost: process.env.EMAIL_HOST,
    nodemailerUser: process.env.EMAIL_USER,
    nodemailerPassword: process.env.EMAIL_PASSWORD,
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/device',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],
  veeValidate: {
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
});
