// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@vuestic/nuxt','@nuxtjs/tailwindcss', '@nuxtjs/sanity'],
    
    sanity: {
        projectId: 'diimhezu',
        apiVersion: '2021-10-21',
        dataset: 'prod',
        useCdn: false,
    },
 
    css: ['@/assets/css/config.css'],
})
