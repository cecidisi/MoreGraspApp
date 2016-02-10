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
          'config/*.js'
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
    'develop',
    'watch'
  ]);
};
