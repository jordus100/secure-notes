/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    env: {
        NEXTAUTH_SECRET: 'omegasecret'
    }
};

export default nextConfig;
