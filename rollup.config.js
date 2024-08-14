import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const publicConfig = {
    format: 'umd',
    name: 'uodule'
}

const config = defineConfig([
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs',
                ...publicConfig
            },
            {
                file: 'dist/index.min.js',
                ...publicConfig,
            }
        ],
        plugins: [
            typescript({
                declaration: false,
                target: "ES5"
            })
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.mjs',
            format: 'esm'
        },
        plugins: [
            typescript({
                declaration: false
            })
        ]
    },
    // 归并 .d.ts 文件
    // {
    //     input: 'types/index.d.ts',
    //     output: {
    //         file: 'index.d.ts',
    //         format: 'es'
    //     },
    //     plugins: [
    //         // 将类型文件全部集中到一个文件中
    //         dts(),
    //         // 在构建完成后，删除 types 文件夹
    //         del({
    //             targets: 'types',
    //             hook: 'buildEnd'
    //         })
    //     ]
    // }
])

export default config
