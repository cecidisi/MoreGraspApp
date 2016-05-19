'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;
    
  var paths = {
      app: 'app',
      dist: 'dist'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: paths,
    develop: {
      server: {
        file: 'app.js'
      }
    },
    sass: {
      dist: {
        files: {
            'public/css/rp-style.css': 'public/css/rp/main.scss',
            'public/css/mm-style.css': 'public/css/mm/main.scss',
          //'public/css/**/*.css': 'public/css/**/*.scss'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
          'public/js/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      css: {
        files: [
          'public/css/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: [
          'app/views/*.jade',
          'app/views/**/*.jade'
        ],
        options: { livereload: reloadPort }
      },
      sass: {
        files: ['./public/css//{,*/}*.{scss,sass}'],
        //tasks: ['sass:server', 'autoprefixer'],
        tasks: ['sass:dist']
      }
    },
      // Automatically inject Bower components into the HTML file
      wiredep: {
          options: {
              directory: 'public/components',   
              overrides: {
                  'jquery-ui': {
                      main: [ "jquery-ui.min.js", "themes/base/jquery-ui.min.css" ]
                  }
              }
          },
          app: {
//              ignorePath: /^\/|\.\.\//,
              ignorePath: /(..\/)*(public)/,
              src: ['<%= paths.app %>/views/{,*/}*.jade'],
              //cwd: './public/',
              overrides: {
                  'jquery-uploadfile': {
                      main: [
                          "js/jquery.uploadfile.js",
                          "css/uploadfile.css"
                      ]
                  }
              }
          },
          sass: {
              src: ['public/css/{,*/}*.{scss,sass}'],
              //  ignorePath: /(\.\.\/){1,2}bower_components\//
          }
      },

      // to generate dist
      // Empties folders to start fresh
      clean: {
          dist: {
              files: [{
                  dot: true,
                  src: [
                      '.tmp',
                      '<%= paths.dist %>/*',
                      '!<%= paths.dist %>/.git*',
                      '<%= paths.app %>/views_dist',
                  ]
              }]
          }
      },
      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      jadeUsemin: {
          options: {
              tasks: {
                  js: ['concat', 'uglify'],
                  css: ['concat', 'autoprefixer', 'cssmin']
              },//dirTasks: ['filerev']
              targetPrefix: '<%= paths.dist %>'
          },
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= paths.app %>/views/mm',
                  src: ['*.jade'],
                  dest: '<%= paths.app %>/views_dist/mm',
                  ext: '.jade'
              },
              {
                  expand: true,
                  cwd: '<%= paths.app %>/views/rp',
                  src: ['*.jade'],
                  dest: '<%= paths.app %>/views_dist/rp',
                  ext: '.jade'
              },{
                  src: '<%= paths.app %>/views/error.jade',
                  dest: '<%= paths.app %>/views_dist/error.jade'
              }]
          }
      },
      copy: {
        dist: {
          files:[{
            expand: true,
            dot: true,
            cwd: '.',
            flatten: true,
            src: 'public/fonts/{,*/}*.*',
            dest: '<%= paths.dist %>/fonts/'
          }, {
            expand: true,
            dot: true,
            cwd: 'public/',
            dest: '<%= paths.dist %>',
            src: [
              '*.ico',
              'media/{,*/}*.{png,jpg,gif}'
            ]
          },{
            expand: true,
            dot: true,
            cwd: '.',
            flatten: true,
            src: 'public/i18n/{,*/}*.{js,json}',
            dest: '<%= paths.dist %>/i18n/'
          }]
        }
      },
      'json-minify': {
        dist: {
          files: '<%= paths.dist %>/i18n/*.json'
        }
      },
      replace: {
        dist: {
          src: ['<%= paths.dist %>/css/{,*/}*.css'],
            overwrite: true,                 // overwrite matched source files
            replacements: [{
              from: '../fonts/bootstrap/',
              to: '../fonts/'
            }]
          }
      },
      rev: {
        dist: {
          files: {
            src: [
              '<%= paths.dist %>/js/{,*/}*.js',
              '<%= paths.dist %>/css/{,*/}*.css',
              '<%= paths.dist %>/media/{,*/}*.*',
              '<%= paths.dist %>/fonts/{,*/}*.*',
              '<%= paths.dist %>/*.{ico,png}'
            ]
          }
        }
      },
      useminPrepare: {
        options: {
          dest: '<%= paths.dist %>'
        },
        html: '<%= .app %>/index.html'
        //html: ['<%= config.dist %>/{,*/}*.html']
      },
      usemin: {
        css: ['<%= paths.dist %>/css/{,*/}*.css'],
        jade: ['<%= paths.app %>/views_dist/rp/{,*/}*.jade', '<%= paths.app %>/views_dist/mm/{,*/}*.jade'],
        options: {
          assetsDirs: [
            '<%= paths.dist %>',
            '<%= paths.dist %>/fonts'
            //'<%= paths.dist %>/media',
            //'<%= paths.dist %>/css',
            //'<%= paths.dist %>/js'
          ],
          patterns: {
            jade: require('usemin-patterns').jade
          }
        }
      },
      mkdir: {
        public: {
          create: ['./public/uploads']
        },
        dist: {
          options: {
            //mode: 0755,
            create: ['<%= paths.dist %>/uploads']
          }
        }
      }

  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'wiredep',
    'sass',
    'mkdir:public',
    'develop',
    'watch'
  ]);

  grunt.registerTask('build', [
      'clean:dist',
      'wiredep',
      'sass',
      'jadeUsemin',
      'copy:dist',
      'json-minify',
      'replace:dist',
      'rev',
      'usemin',
      'mkdir:dist'
  ]);


};
