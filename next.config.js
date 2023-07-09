/** @type {import('next').NextConfig} */

// const nextConfig = {
//     // async redirects() {
//     //     return [
//     //       {
//     //         source: '/',
//     //         destination: '/auth/login',
//     //         permanent: true,
//     //       },
//     //     ]
//     //   },
// }

// module.exports = nextConfig


const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
    reactStrictMode: true
}
  
module.exports = withPWA(nextConfig)