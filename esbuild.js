require('esbuild').build({
  entryPoints: ['src/index.js'],
  bundle: true,
  watch: true,
  globalName: 'd3',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1))

require('esbuild').build({
  entryPoints: ['src/main.js'],
  bundle: true,
  watch: true,
  outfile: 'dist/main.js',
}).catch(() => process.exit(1))
