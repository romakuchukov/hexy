import configs from './rollup.config';
import { terser } from 'rollup-plugin-terser';

configs.forEach(config => {
  Object.assign(config, { plugins: [...config.plugins, terser()] });
});

export default configs;