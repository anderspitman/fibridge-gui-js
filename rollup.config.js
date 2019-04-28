import htmlTemplate from 'rollup-plugin-generate-html-template';
import resolve from 'rollup-plugin-node-resolve';
//import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
  },
  plugins: [
    //terser(),
    resolve(),
    htmlTemplate({
      template: 'src/template.html',
      target: 'index.html',
    }),
  ],
};
