module.exports = function ( grunt ) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-coffeelint');

  var userConfig = require( './build.config.js' );

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    copy: {
      build_app_assets: {
        files: [
          {
            src: [ '<%= app_files.assets %>' ],
            dest: "<%= build_dir %>",
            cwd: '.',
            expand: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: [ '<%= vendor_files.css %>' ],
            dest: '<%= build_dir %>',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorhtml: {
        files: [
          {
            src: [ '<%= vendor_files.html %>' ],
            dest: '<%= build_dir %>',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    jade: {
      build: {
        files: [
          {
            expand: true,
            cwd: ".",
            src: [ '<%= app_files.jade %>' ],
            dest: '<%= build_dir %>',
            ext: ".html"
          }
        ],
        options: {
            client: false,
            pretty: true
        }
      }
    },

    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= app_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    less: {
      build: {
        files: [
          {
            expand: true,
            cwd: ".",
            src: [ '<%= app_files.less %>' ],
            dest: '<%= build_dir %>',
            ext: ".css"
          }
        ]
      },
      compile: {
        files: [
          {
            expand: true,
            cwd: ".",
            src: [ '<%= app_files.less %>' ],
            dest: '<%= build_dir %>',
            ext: ".css"
          }
        ],
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    coffeelint: {
      src: {
        files: {
          src: [ '<%= app_files.coffee %>' ]
        }
      }
    },

    index: {
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= vendor_files.html %>'
        ]
      },
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= vendor_files.html %>',
          '<%= build_dir/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    delta: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: 'gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [
          'jshint:src',
          'copy:build_appjs'
        ]
      },
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: [
          'coffeelint:src',
          'coffee:source',
          'copy:build_appjs'
        ]
      },
      assets: {
        files: [
          '<%= app_files.assets %>'
        ],
        tasks: [
          'copy:build_app_assets'
        ]
      },
      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'index:build' ]
      },
      jade: {
        files: [ '<%= app_files.jade %>' ],
        tasks: [ 'index:build' ]
      },
      less: {
        files: [ '<%= app_files.less %>' ],
        tasks: [ 'less:build' ]
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ));

  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'delta' ] );

  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  grunt.registerTask( 'build', [
    'clean', 'jshint', 'coffeelint', 'coffee',
    'jade:build', 'less:build',
    'copy:build_app_assets', 'copy:build_appjs',
    'copy:build_vendorjs', 'copy:build_vendorhtml', 'copy:build_vendorcss',
    'index:build'
  ]);

  grunt.registerTask( 'compile', [
    'less:compile', 'copy:compile_assets', 'index:compile'
  ]);

  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy('src/index.html', this.data.dir + '/src/index.html', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });
};
