// rollup.config.js
import amd from 'rollup-plugin-amd';

export default {
    input: './src/js/index.js',
    output: {
        file: 'vast-parser.amd.js',
        format: 'amd'
    },
    plugins: [
        amd({
            include: 'src/js/**' // Optional, Default: undefined (everything)
        })
    ]
};