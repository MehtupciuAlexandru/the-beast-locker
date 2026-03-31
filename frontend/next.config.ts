import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


};

module.exports = {
    images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/assets/**",
            },
        ],
    },
};
export default nextConfig;
