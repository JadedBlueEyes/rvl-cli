const tlpackage = require('./package');

const preamble = `${tlpackage.name} v${tlpackage.version} ©${new Date().getFullYear()}`;

const gulp = require('gulp');



let minifyConfig = {
  compress: {
    unsafe: true,
    passes: 2,
    keep_fargs: false,
    drop_console: true,
    arguments: true
  },
  mangle: {
    properties: false,
    toplevel: true
  },
  output: {
    beautify: false,
    preamble: '/* ' + preamble + ' */',
    safari10: true,
    webkit: true
  }
  // TODO: nameCache: {}
};


function js () {
  return gulp.src(['./src/*.js'])
    .pipe(require('gulp-terser')(minifyConfig)) // TODO: add babel
    .pipe(gulp.dest('./bin'));
}



module.exports = {
  default: js
};
