import resolve    from '@rollup/plugin-node-resolve'
import commonjs   from '@rollup/plugin-commonjs'
import terser     from '@rollup/plugin-terser';


export default [
	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: 'src/fs-toolbox.js',
		external: [ 'ask-for-promise', 'fs'],
		output: [
			{ file: 'dist/fsbox.cjs'    , format: 'cjs' },
			{ file: 'dist/fsbox.esm.mjs', format: 'es' }
		],
		plugins: [ 
                resolve(), 
                commonjs(), 
                terser() 
            ]
	}
];