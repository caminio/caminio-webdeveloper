
module.exports = function(grunt) {

  'use strict';

  var _         = require('lodash');
  var async     = require('async');
  var fs = require('fs');

  // Project configuration.
  grunt.initConfig({

    mochaTest: {
      test: {
        options: {
          globals: ['should'],
          timeout: 4000,
          bail: true,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        },
        src: ['test/**/*.test.js']
      }
    }, 

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build']
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* camin.io */'
        },
      },
      combine: {
        files: {
          'build/stylesheets/caminio-ui.min.css': [ 'assets/stylesheets/3rdparty/*.css',
                                                    'assets/stylesheets/caminio-ui/*.css' ],
          'build/stylesheets/caminio-auth.min.css': [ 'assets/stylesheets/caminio-auth/authorization.css' ],
          'build/stylesheets/caminio-profiles.min.css': [ 'assets/stylesheets/caminio-profiles/*.css' ],
          'build/stylesheets/caminio-dashboard.min.css': [ 'assets/stylesheets/caminio-dashboard/*.css' ],
          'build/stylesheets/caminio-api-3rd.min.css': [ 'assets/stylesheets/caminio-api-app/**/*.css' ]
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
            'assets/javascripts/3rdparty/jquery-1.10.2.js',
            'assets/javascripts/3rdparty/handlebars-1.1.2.js',
            'assets/javascripts/3rdparty/ember.prod.min.js',
            'assets/javascripts/3rdparty/masonry.min.js',
            'assets/javascripts/3rdparty/ember-data.prod.min.js',
            'assets/javascripts/3rdparty/inflection.min.js',
            'assets/javascripts/3rdparty/filesize.min.js',
            'assets/javascripts/3rdparty/select2.min.js',
            'assets/javascripts/3rdparty/typeahead.min.js',
            'assets/javascripts/3rdparty/jquery.nicescroll.min.js',
            'assets/javascripts/3rdparty/ember-i18n.js',
            'assets/javascripts/3rdparty/jquery-ui-1.10.4.custom.min.js',
            'assets/javascripts/3rdparty/jquery-ui-datepicker.de.js',
            'assets/javascripts/3rdparty/bootstrap.min.js',
            'assets/javascripts/3rdparty/bootstrapbox.min.js',
            'assets/javascripts/3rdparty/moment.min.js',
            'assets/javascripts/3rdparty/jquery.sparkline.min.js',
            'assets/javascripts/3rdparty/jquery.block-ui.js',
            'assets/javascripts/3rdparty/pace.min.js',
            'assets/javascripts/3rdparty/raphael-2.1.0.min.js',
            'assets/javascripts/3rdparty/morris-0.4.3.min.js'
          ],
        dest: 'build/javascripts/3rdparties.min.js'
      },
      api3rd: {
        src: [
            'assets/javascripts/3rdparty/select2.min.js',
            'assets/javascripts/3rdparty/marked.min.js',
            'assets/javascripts/3rdparty/handlebars-1.1.2.js',
            'assets/javascripts/3rdparty/ember.prod.min.js',
            'assets/javascripts/3rdparty/ember-data.prod.min.js',
            'assets/javascripts/3rdparty/ember-i18n.js',
            'assets/javascripts/3rdparty/jquery.inputmask.min.js',
            'assets/javascripts/caminio-api-app/app.js',
        ],
        dest: 'build/javascripts/caminio-api.bundle.min.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> TASTENWERK \n' +
            '* Available via the MIT license.\n' +
            '* see: http://opensource.org/licenses/MIT for blueprint.\n' +
            '*/\n'
      },
      build: {
        files: {
          'build/javascripts/caminio.min.js': [
            'assets/javascripts/caminio/locales/*.js',
            'assets/javascripts/caminio/util.js',
            'assets/javascripts/caminio/pickers.js',
            'assets/javascripts/caminio/tabs.js',
            'assets/javascripts/caminio/ember-tree.js',
            'assets/javascripts/caminio/helpers/*.js',
            'assets/javascripts/caminio/app-core.js',
            'assets/javascripts/caminio/views/*.js',
            'assets/javascripts/caminio/table_controller.js',
            'assets/javascripts/caminio-ui/models/client.js',
            'assets/javascripts/caminio/models/*.js',
            'assets/javascripts/caminio/labels.js',
            'assets/javascripts/caminio/notifications.js'
          ],
          'build/javascripts/caminio-ui.min.js': [
            'assets/javascripts/caminio-ui/locales/*.js',
            'assets/javascripts/caminio-ui/router.js',
            'assets/javascripts/caminio-ui/models/domain.js',
            'assets/javascripts/caminio-ui/controllers/*.js',
            'assets/javascripts/caminio-ui/views/*.js'
          ],
          'build/javascripts/caminio-profiles.min.js': [
            'assets/javascripts/caminio-profiles/locales/*.js',
            'assets/javascripts/caminio-profiles/app.js'
          ],
          'build/javascripts/caminio-admin.min.js': [
            'assets/javascripts/caminio-admin/**/*.js'
          ],
          'build/javascripts/caminio-dashboard.min.js': [
            'assets/javascripts/caminio-dashboard/**/*.js'
          ],
          'build/javascripts/caminio-components.min.js': [
            'assets/javascripts/caminio/components/*.js'
          ],
          'build/javascripts/caminio-api-app.min.js': [
            'assets/javascripts/caminio-api-app/*.js',
          ]
        }
      }
    },

    copy: {
      img: {
        files: [
          { 
            expand: true,
            cwd: 'assets/images',
            src: ['**/*'], 
            dest: 'build/images/'
          }
        ]
      },
      fonts: {
        files: [
          { 
            expand: true,
            cwd: 'assets/fonts/',
            src: ['**/*'], 
            dest: 'build/fonts/'
          }
        ]
      }
    },

    mocha_phantomjs: {
      all: ['test/browser/unit/**/*.html']
    },

    jshint: {
      all: ['Gruntfile.js', 'api/**/*.js', 'config/**/*.js', 'assets/javascripts/caminio-ui/app'],
      options: {
        "laxcomma": true
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // tests
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'cssmin',
    'copy:img',
    'copy:fonts',
    'uglify',
    'concat:dist',
    'concat:api3rd'
  ]);

  grunt.registerTask('startServer', function(){
    process.env.NODE_ENV = 'test';
    
    var done = this.async();    
    
    var caminio = require('caminio');
    var Gear = require('caminio/gear');
    require('caminio-auth'); // require this gear
    require('./'); // require this gear
    new Gear({ api: true, absolutePath: __dirname+'/test/support/app' });

    caminio.init({ 
      config: { 
        root: __dirname+'/test/support/app',
        log: {
          filename: process.cwd()+'/test.log'
        }
      }
    });

    // clean up database;
    caminio.on('ready', function(){
      async.each( Object.keys(caminio.models), function(modelName, next){
        caminio.models[modelName].remove({}, function(err){
          if( err ) console.log(err);
          next();
        });
      }, done );
    });

  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'runs all tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testUnit', 'runs only unit tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testModels', 'runs only model tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*model.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testApi', 'runs only api tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.api.*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('clearLogs', function(){
    if( fs.existsSync('test.log') )
      fs.unlinkSync('test.log');
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('todo', [
    'jshint',
    'startServer',
    'mocha_phantomjs'
    ]);

};
