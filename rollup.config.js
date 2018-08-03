// rollup.config.js
import amd from 'rollup-plugin-amd';

export default {
    input: './src/index.js',
    output: {
        file: 'vast-parser.amd.js',
        format: 'amd'
    },
    plugins: [
        amd({
            include: 'src/**' // Optional, Default: undefined (everything)
        })
    ]
};
