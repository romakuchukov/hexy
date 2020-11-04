import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';

const src = 'src/';
const dist = 'dist';

const plugins = [node(), babel()];

const onwarn = (warning, warn) => {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  warn(warning);
};

export default [{
  onwarn: onwarn,
  input: `${src}index.js`,
  output: {
    name: 'd3',
    dir: dist,
    format: 'umd',
    entryFileNames: 'lib.min.js'
  },
  plugins
}, {
  input: `${src}main.js`,
  output: {
    name: 'Main',
    format: 'iife',
    dir: dist,
    entryFileNames: 'main.min.js'
  },
  plugins
}];
