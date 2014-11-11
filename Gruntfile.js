var
  LIVERELOAD_PORT = 35729,
  lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
  }),
  mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n' +
      '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　\n' +
      '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　丶丶亅亅亅丶　　　　　　　　\n' +
      '　　　　　　　　　　　丶乙瓦瓦十丶　　　　　　　　　乙車鬼毋車毋己毋車毋車乙　　　　　\n' +
      '　　　　　　　　　亅日馬馬龠車己瓦乙亅十十十十十乙日鬼鬼日乙己瓦車車毋毋車車亅　　　　\n' +
      '　　　丶丶　　十己鬼馬鬼乙己己日己己日日日日瓦毋日瓦鬼車毋日毋瓦毋馬瓦瓦日毋己　　　　\n' +
      '　　毋龠馬瓦車龠龠車乙　　己己日日毋車毋瓦瓦瓦車瓦毋車龠龍鬼毋毋日日乙亅己毋亅　　　　\n' +
      '　亅龍毋己己己乙亅　　　　己瓦瓦車毋車毋日瓦毋瓦車車鬼鬼瓦馬毋瓦瓦己　　　　　　　　　\n' +
      '　丶丶　　　　　　亅十亅乙瓦毋己毋毋乙毋車瓦毋毋毋車車十十馬車乙瓦車亅　　　　　　　　\n' +
      '　　　　　　　　丶己毋瓦瓦毋日毋車龠十亅己車車毋瓦日乙亅十日鬼毋己己己亅　　　　　　　\n' +
      '　　　　丶日十亅十車瓦瓦日瓦毋車鬼己　　　亅十己瓦日己亅　亅毋鬼瓦日己日己十丶　　　　\n' +
      '　　　　亅毋瓦乙瓦乙丶丶亅日車己丶　　　　　　　　丶　　　　　亅己己十日車鬼己十亅亅丶\n' +
      '　　　　　　己亅丶　　　　　　　　　　　　　　　　　　　　　　　　　　　丶十乙毋日日亅\n' +
      '',
    // Task configuration.
    connect: {
      options: {
        port: 1881,
        hostname: '0.0.0.0',
        open: false,

      },

      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      dist: {
        options: {
          port: 1882,
          keepalive: true,
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'dist')
            ];
          }
        }
      }

    },
    clean: {
      css: ['app/style/css/app.css'],
      dist: ['dist/*']

    },
    uglify: {
            options: {
                compress: true
            },
            dist: {
                src: 'app/bower_components/requirejs/require.js',
                dest: 'dist/script/require.min.js'
            }
        },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    watch: {
      options: {
        livereload: LIVERELOAD_PORT
      },
      less: {
        files: ['app/style/less/**'],
        tasks: ['clean:css', 'less:dev']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower']
      },
      targethtml:{
        files: ['index.tpl'],
        tasks: ['targethtml']
      },
      concatmodule : {
        files:['app/script/controllers/**'],
        tasks:['concatmodule'],
        options: {
                  event: ['added', 'deleted'],
                }
      }
    },
    copy:{
      dist: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['**', '!**/less/**', '!**/res/**', '!**/bower_components/**','!**/script/**', '!**/*.less', '!index.html', '!**/app.css'],
          dest: 'dist/'
        }]
      },
    },
    bower: {
      target: {
        rjsConfig: 'app/script/main.js'
      }
    },
    targethtml: {
      options: {
        curlyTags: {
          appname: '<%=pkg.name%>',
          version: '<%=pkg.version%>',
          rlsdate: '<%= grunt.template.today("yyyymmddHHMM") %>',
          rlsdate2: '<%= grunt.template.today("yyyy.mm.dd HH:MM") %>',
          banner: '<!-- <%= banner %> -->'
        }
      },
      dist: {
        files: {
          'dist/index.html': 'index.tpl'
        }
      },
      dev: {
        files: {
          'app/index.html': 'index.tpl'
        }
      }
    },
    requirejs: {
      options: {
        optimize: 'uglify',
        logLevel: 0,
        inlineText: true,
        preserveLicenseComments: true,
        wrap: {
          start: '/** <%= banner %> **/\n'
        }
      },
      dist: {
        options: {
          mainConfigFile: 'app/script/main.js',
          name: 'main',
          out: 'dist/script/<%=pkg.name%>.min.js',
          preserveLicenseComments: false,
          locale: false
        }
      }
    },
    less: {
      dev: {
        options: {
          strictImports: false
        },
        files: {
          'app/style/css/app.css': 'app/style/less/app.less'
        }
      },
      dist: {
        options: {
          cleancss: true,
          strictImports: false,
          report: 'min'
        },
        files: {
          'dist/style/css/<%=pkg.name%>.min.css': 'app/style/less/app.less'
        }
      }
    },
    concatmodule: {
            
            controllermodule: {
                files:[{
                  //expand: true,
                  cwd:'app/script/controllers/',
                  src:'*.js',
                  dest:'app/script/controllermodule.js'
                }],
                options: {
                    //src: 'app/scripts/controllers/',
                    prefix: './controllers/',
                    dest: 'app/script/controllermodule.js'
                }
            },
            
            options: {
                banner: '/** <%= banner %> **/\n'
            }
        }
  });

  // These plugins provide necessary tasks.
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.loadNpmTasks('grunt-bower-requirejs');

  // Default task.
  grunt.registerTask('default', [
    //'jshint',
    'clean:dist',
    'targethtml:dist',
    'less:dist',
    'requirejs:dist',
    'copy:dist',
    'uglify:dist',
    'connect:dist'

  ]);

  grunt.registerTask('dev', [
    //'jshint',
    'less:dev',
    'targethtml:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerMultiTask('concatmodule',function(){
        var path   = require('path');
        var options = this.options();

        var log  = (function(msg){
            grunt.log.writeln(this.name + ':' + this.target + ' ' + msg);
        }).bind(this);
        
        var prefix, dest;
        var js;
        var files = [];
        prefix = options.prefix;
        dest   = options.dest;
        prefix = prefix ? (prefix.slice(-1) === '/' ? prefix : prefix + '/') : '';
       this.files.forEach(function(f) {
        // Concat specified files.
        var cwd = f.cwd;
        var src = f.src.filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          var file = path.resolve(cwd,filepath);
          if (!grunt.file.exists(file)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).map(function(filepath) {
          
          return path.basename(filepath).replace(/\.js$/,'');
          //
          //return grunt.file.read(filepath);
        })//.join(grunt.util.normalizelf(options.separator));
        files = files.concat(src);
      })
        //log(files.join(','));
        js = options.banner ? options.banner + '\n' : '';
        js += "define([\n";
        js += "'" + prefix;
        js += files.join("',\n'" + prefix);
        js += "'],function(";
        js += files.join(",");
        js += "){\n";
        js += "var module = {};\n";
        files.forEach(function(file) {
            js += "module['" + file + "']=" + file + ";\n";
        });
        js += "module.module = function(m){return module[m];}\n";
        js += "return module;\n});";
        grunt.file.write(path.resolve(dest), js);
        log('task write file : ' + path.resolve(dest));
    });

};