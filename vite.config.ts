import {defineConfig} from 'vite';
import dts from 'unplugin-dts/vite';

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
            bundleTypes: true,
        }),
    ],
});
