import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: "loose", // Enables better .mjs support
  },
  webpack(config) {
    // Preserve your existing rule for pdf.worker.min.mjs
    config.module.rules.push({
      test: /pdf\.worker\.min\.mjs$/,
      type: "asset/resource",
    })

    // Add extension alias to help Next resolve .mjs files properly
    config.resolve.extensionAlias = {
      ".js": [".js", ".mjs"],
    }

    return config
  },
}

export default nextConfig
