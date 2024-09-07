import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
    return {
        build: {
            minify: true,
            sourcemap: true,
            lib: {
                entry: './src/index.ts',
                name: 'chartjs-v4-webcomponent',
                fileName: (format) => `chartjs-v4-webcomponent.${format}.js`,
            },
        },
        plugins: [
            dts({
                rollupTypes: true,
            }),
        ],
    };
});
