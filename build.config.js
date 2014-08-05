module.exports = {
  build_dir: 'build',
  compile_dir: 'dist',

  app_files: {
    html: [ 'src/index.html' ],
    jade: [ 'src/views/**/*.jade' ],
    js: [ 'src/app.js', 'src/controllers/**/*.js', 'src/directives/**/*.js', 'src/services/**/*.js' ],
    coffee: [ 'src/app.coffee', 'src/controllers/**/*.coffee', 'src/directives/**/*.coffee', 'src/services/**/*.coffee' ],
    less: [ 'src/styles/**/*.less' ],
    assets: ['src/assets/**/*.png' ]
  },

  vendor_files: {
    js: [
      'src/lib/angular/angular.min.js',
      'src/lib/platform/platform.js',
      'src/lib/**/*.js'
    ],
    html: [
      'src/lib/**/*.html'
    ],
    css: [
      'src/lib/**/*.css'
    ]
  }
};
