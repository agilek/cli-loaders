import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isLib = command === 'build';

  return {
    plugins: [
      react(),
      ...(isLib
        ? [dts({ include: ['src'], rollupTypes: true })]
        : []),
    ],
    ...(isLib && {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'CliLoaders',
          formats: ['es', 'cjs'],
          fileName: format => `cli-loaders.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
          external: ['react', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react/jsx-runtime': 'ReactJSXRuntime',
            },
          },
        },
      },
    }),
  };
});
