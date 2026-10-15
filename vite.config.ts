import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: './src/index.ts',
            name: 'chartjs-v4-webcomponent',
            formats: ['es'],
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});
