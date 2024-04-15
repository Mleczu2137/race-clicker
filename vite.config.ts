import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv("all", process.cwd(), "VITE_");

  return {
    define: {
      "process.env": {
        IP_ADDRESS: env.VITE_IP_ADDRESS ?? "ws://localhost:25555",
      },
    },
    server: {
      host: true,
    },
    plugins: [react()],
  };
});
