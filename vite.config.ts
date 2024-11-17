import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = {
    KV_URL:
      "rediss://:AVJjAAIjcDE3NzBjMGI2MTdkNjc0OWQ2OTliZWY3M2VkNjZlNjNkN3AxMA@prime-egret-21091.upstash.io:6379",
    KV_REST_API_READ_ONLY_TOKEN:
      "AlJjAAIgcDHSuNys7jU_iVZh8iDjkZ7VYQKr03vUAege3MRLM0e8jw",
    KV_REST_API_TOKEN:
      "AVJjAAIjcDE3NzBjMGI2MTdkNjc0OWQ2OTliZWY3M2VkNjZlNjNkN3AxMA",
    KV_REST_API_URL: "https://prime-egret-21091.upstash.io",
  };

  return {
    plugins: [react()],
    
    // vite config
    define: {
      ...Object.keys(env).reduce((prev, key) => {
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_");

        prev[`process.env.${sanitizedKey}`] = JSON.stringify(env[key]);

        return prev;
      }, {}),
      preventAssignment: true,
    },
  };
});

