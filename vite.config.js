import { default as dotEnv } from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  dotEnv.config();
  return {
    plugins: [react()],
    base: '/',
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          entryFileNames: 'assets/[name]-[hash].js',
        },
        onwarn: (warning, warn) => {
          /**
           * Catches a dynamic v static import warning resulting from
           * dynamically importing stores for rehydration.
           *
           * The dynamic import is only needed to prevent trying to act
           * on the stores before they are initialized, not an attempt
           * to move them to a separate chunk.
           */
          if (
            warning.code === 'PLUGIN_WARNING' &&
            warning.message.includes(
              'dynamic import will not move module into another chunk',
            )
          ) {
            return;
          }
          // https://github.com/vitejs/vite-plugin-react/pull/144
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            warning.message.includes('use client')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
    server: {
      open: true,
      port: 3000, // Add this line to set the port to 3000
    },
  };
});
