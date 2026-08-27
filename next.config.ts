import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * pdfjs nạp worker bằng dynamic import lúc chạy. Bundler viết lại đường dẫn đó
   * khiến nó báo "Setting up fake worker failed". Để Node tự require các package
   * này ở runtime thay vì bundle chúng.
   */
  serverExternalPackages: ["pdfjs-dist", "mammoth", "isomorphic-dompurify"],
};

export default nextConfig;
