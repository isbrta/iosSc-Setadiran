import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/scriptable.js',
  bundle: true,
  platform: 'neutral', // نه node نه browser
  target: ['es6'], // خروجی ES6 برای سازگاری
  format: 'iife', // یا 'esm' بسته به نیاز Scriptable
  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.json',
}).catch(() => process.exit(1));
