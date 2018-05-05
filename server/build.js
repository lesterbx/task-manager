const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

rollup.rollup({
  input: 'server/index.js',
  plugins: [ babel({ runtimeHelpers: true }) ]
}).then(function (bundle) {
  bundle.write({
    file: 'server/dist/server.js',
    format: 'cjs'
  });
});