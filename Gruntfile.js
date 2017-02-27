var testServer = 'http://localhost:8000/';

var util = require('./lib/grunt/utils.js');
var files = require('./appFiles').files;
var rewriteModule = require('http-rewrite-middleware');
var proxy = require('proxy-middleware');

var destinationPath = "dist";
var srcPath = "./src";
var distPath = "./"+destinationPath;
var oldBuildPath = './build';
var buildPath = distPath;
var tmpPath = "./tmp";
var staticPath = "static";
var versionFile = "./version.txt";

var bowerPath = "./bower_components";

module.exports = function (grunt) {
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	// require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-git');

	grunt.initConfig({
		version: (grunt.file.exists(versionFile))? grunt.file.read(versionFile) : (new Date()).getTime(),

		pkg: grunt.file.readJSON('package.json'),



		// cleanup build directory
		clean: {
			dist: [buildPath, tmpPath, oldBuildPath],
			// final: [tmpPath].concat(otherRepositories)
			// dist: [buildPath, tmpPath, oldBuildPath],
			final: [tmpPath]
		},



		'string-replace': {
			version: {
				files: [
					{
						expand: true,
						cwd: buildPath,
						src: ['**/*.html', '**/*.js', '**/*.css'],
						dest: buildPath,
					}
				],
				options: {
					replacements: [
						{
							pattern: /mosRuVersionControlFlag/g,
							replacement: '<%= version %>'
						}
					]
				}
			}
		},
		concat: {
			jsapp: {
				options: {
					// Replace all 'use strict' statements in the code with a single one at the top
					// banner: "(function(window, angular, undefined) {'use strict';\n",
					banner: "(function(window, angular, undefined) {\n",
					footer: "})(window, window.angular);",
					process: function(src, filepath) {
						return '// Source: ' + filepath + '\n' +
							src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
					},
				},
				// обработанный массив из appFiles.js
				files: util.wrapJS(files.appModules)

			},

			cssapp: {
				options: {
					banner: '@import "../../../../src/css/variables";\n'

				},
				// обработанный массив из appFiles.js
				// склеиваем app/**/*.scss
				// и складываем их во времянку tmp/appcss/scss/_APPNAME_
				files: util.wrapCSS(files.appModules)
			},

			i18nconcat: {
				options: {
					// Replace all 'use strict' statements in the code with a single one at the top
					// banner: "(function(window, angular, undefined) {'use strict';\n",
					banner: "{\n",
					footer: "}",
					process: function(src, filepath) {
						src = src.substring(0,src.lastIndexOf("}"));
						return src.replace(/\{/,",");
					},
				},
				// обработанный массив из appFiles.js
				files: util.wrapI18N(files.appModules)
			},


			// script.js: склейка всех js из папки src/js/user/
			js: {
				src: [srcPath+'/js/user/**/*.js'],
				dest: buildPath+'/'+staticPath+'/js/script.js',
			},
			// libs1.js: склейка всех js из папки src/js/common/priority_01.js
			jslib1: {
				src: [srcPath+'/js/common/priority_01/**/*.js'],
				dest: buildPath+'/'+staticPath+'/js/libs1.js',
			},
			// libs1.js: склейка всех js из папки src/js/common/priority_01.js
			jslib2: {
				src: [srcPath+'/js/common/priority_02/**/*.js'],
				dest: buildPath+'/'+staticPath+'/js/libs2.js',
			},
			// libs1.js: склейка всех js из папки src/js/common/priority_01.js
			jslib3: {
				src: [srcPath+'/js/common/priority_03/**/*.js'],
				dest: buildPath+'/'+staticPath+'/js/libs3.js',
			}
		},




		jshint: {
			options: {
				curly: true,
				eqnull: true,
				browser: true,
				force: true,
				globals: {
					jQuery: true
				}
			},
			dist: [
				srcPath+'/js/user/**/*.js'
			],
			appdir: [
				srcPath+'/app/directives/**/*.js', '!'+srcPath+'/app/directives/**/*.min.js'
			],
			appmod: [
				srcPath+'/app/modules/**/*.js', '!'+srcPath+'/app/modules/**/*.min.js'
			],
			appsrv: [
				srcPath+'/app/services/**/*.js', '!'+srcPath+'/app/services/**/*.min.js'
			],
			configFiles: [
				'.csscomb.json',
				'Gruntfile.js',
				'package.json'
			]
		},


		pug: {
			build: {
				options: {
					compileDebug:false,
					pretty: true,
					processContent: function(content, filename){
						content = content.replace(/\/\/ \%add counters here\%/g,'+counters');
						return content;
					}
				},
				files: [
					{
						cwd: srcPath+'/templates',
						src: [
							'**/*.jade',
						],
						dest: buildPath+'/',
						expand: true,
						rename: function (dest, src) {
							var folder    = src.substring(0, src.lastIndexOf('/'));
							var filename  = src.substring(src.lastIndexOf('/'), src.length);
							filename  = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.html';
						}
					},
					{
						cwd: srcPath+'/',
						src: [
							'static/templates/**/*.jade',
						],
						dest: buildPath+'/',
						expand: true,
						rename: function (dest, src) {
							var folder    = src.substring(0, src.lastIndexOf('/'));
							var filename  = src.substring(src.lastIndexOf('/'), src.length);
							filename  = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.html';
						}
					}
				]
			},
			dev: {
				options: {
					compileDebug:false,
					pretty: true
				},
				files: [
					{
						cwd: srcPath+'/templates',
						src: [
							'**/*.jade',
						],
						dest: buildPath+'/',
						expand: true,
						rename: function (dest, src) {
							var folder    = src.substring(0, src.lastIndexOf('/'));
							var filename  = src.substring(src.lastIndexOf('/'), src.length);
							filename  = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.html';
						}
					},
					{
						cwd: srcPath+'/',
						src: [
							'static/templates/**/*.jade',
						],
						dest: buildPath+'/',
						expand: true,
						rename: function (dest, src) {
							var folder    = src.substring(0, src.lastIndexOf('/'));
							var filename  = src.substring(src.lastIndexOf('/'), src.length);
							filename  = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.html';
						}
					}
				]
			},
			tilda: {

			},
			app: {
				options: {
				},
				files: [
					{
						cwd: srcPath+'/app/',
						src: ['**/*.jade'],
						dest: tmpPath+'/tpl/',
						expand: true,
						// ext: '.html'
						rename: function (dest, src) {
							var folder    = src.substring(0, src.lastIndexOf('/'));
							var filename  = src.substring(src.lastIndexOf('/'), src.length);
							filename  = filename.substring(0, filename.lastIndexOf('.'));
							return dest + folder + filename + '.tpl.html';
						}
					}
				]
			},
		},




		// html шаблоны директив переправить в js


		// html2js: {
		// 	app: util.html2js(files.appModules)
		// }
		html2js:
			util.html2js(files.appModules),




		// compile scss -> css and place css to build directory
		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: srcPath+'/css',
						src: 'style.scss',
						dest: tmpPath+'/css/compiled',
						ext: '.css'
					},
					{
						expand: true,
						cwd: srcPath+'/css',
						src: 'docs.scss',
						dest: tmpPath+'/css/compiled',
						ext: '.css'
					}
				]
				//  {
				// 	tmpPath+'/css/compiled/style.css': 'src/css/style.scss',
				// 	tmpPath+'/css/compiled/docs.css': 'src/css/docs.scss'
				// }
			},
			app: {
				expand: true,
				cwd: tmpPath+'/appcss/scss/',
				src: '**/*.scss',
				dest: tmpPath+'/appcss/compiled/',
				ext: '.min.css'
			}
		},





		autoprefixer: {
			options: {
				browsers: [
					'Android >= <%= pkg.browsers.android %>',
					'Chrome >= <%= pkg.browsers.chrome %>',
					'Firefox >= <%= pkg.browsers.firefox %>',
					'Explorer >= <%= pkg.browsers.ie %>',
					'iOS >= <%= pkg.browsers.ios %>',
					'Opera >= <%= pkg.browsers.opera %>',
					'Safari >= <%= pkg.browsers.safari %>'
				]
			},
			dist: {
				// src: ['tmp/css/compiled/*.css']
				expand: true,
				cwd: tmpPath+'/css/compiled/',
				src: '**/*.css',
				dest: tmpPath+'/css/autoprefix/'
			},
			app: {
				// src: ['tmp/appcss/compiled/**/*.css']
				expand: true,
				cwd: tmpPath+'/appcss/compiled/',
				src: '**/*.css',
				dest: tmpPath+'/appcss/autoprefix/'
			}
		},

		combine_mq: {
			dist: {
				expand: true,
				// cwd: 'tmp/css/compiled',
				cwd: tmpPath+'/css/autoprefix',
				src: '*.css',
				dest: tmpPath+'/css/combine_mq'
			},
			app: {
				expand: true,
				// cwd: 'tmp/appcss/compiled',
				cwd: tmpPath+'/appcss/autoprefix',
				src: '**/*.css',
				dest: tmpPath+'/appcss/combine_mq'
			}
		},

		cssmin: {
			options: {
				keepBreaks: true,
				keepSpecialComments: 0,
				compatibility: {
					units: {
						pc: false
					}
				}
			},
			dist: {
				files: [
					{
						expand: true,
						// cwd: 'tmp/css/csscomb',
						cwd: tmpPath+'/css/combine_mq',
						src: ['*.css', '!*.min.css'],
						dest: buildPath+'/'+staticPath+'/css',
						ext: '.min.css'
					}
				]
			},
			app: {
				files: [
					{
						expand: true,
						// cwd: 'tmp/appcss/csscomb',
						cwd: tmpPath+'/appcss/combine_mq',
						src: '**/*.css',
						dest: buildPath+'/'+staticPath+'/app',
						ext: '.min.css'
					}
				]
			}
		},


		// prettify: {
		// 	options: {
		// 		brace_style: 'expand',
		// 		indent: 1,
		// 		indent_char: '	',
		// 		condense: true,
		// 		indent_inner_html: true
		// 	},
		// 	all: {
		// 		expand: true,
		// 		cwd: buildPath,
		// 		ext: '.html',
		// 		src: ['**/*.html', '!'+staticPath+'/**/*.html'],
		// 		dest: buildPath
		// 	},
		// },


		// imagemin: {
		// 	images: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: srcPath+'/images',
		// 			src: ['**/*.{png,jpg,JPG,gif}', '!sprite/**/*'],
		// 			dest: buildPath+'/'+staticPath+'/images'
		// 		}]
		// 	},
		// 	icons: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: srcPath+'/icons',
		// 			src: ['**/*.{png,jpg,JPG,gif}', '!sprite/**/*'],
		// 			dest: tmpPath+'/icons'
		// 		}]
		// 	}
		// },


		// grunticon: {
		// 	myIcons: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: tmpPath+'/icons',
		// 			src: ['*.svg', '*.png'],
		// 			dest: buildPath+'/'+staticPath+'/icons'
		// 		}],
		// 		options: {
		// 			enhanceSVG: true,
		// 			tmpDir: "grunticon-tmp"
		// 		}
		// 	}
		// },


		uglify: {
			dist: {
				files: [
					{
						expand: true,
						cwd: buildPath+'/'+staticPath+'/js',
						src: ['script.js'],
						dest: buildPath+'/'+staticPath+'/js',
						ext: '.min.js'
					}
				]
			},
			app:{
				options: {
					sourceMap: false,
					sourceMapIncludeSources: false
					// beautify: true
				},
				files: [
					{
						expand: true,
						cwd: buildPath+'/'+staticPath+'/app',
						src: ['**/*.js', '!**/*.min.js', '!**/mosapp.js'],
						dest: buildPath+'/'+staticPath+'/app',
						ext: '.min.js'
					}
				]
			}
		},

		copy: {
			dependencies: {
				files: [
				]
			},
			tilda: {
			},
			onrequestjs: {
				expand: true,
				cwd: srcPath+'/js/onrequest',
				src: ['**/*.*'],
				dest: buildPath+'/'+staticPath+'/js'
			},
			mosapp: {
				expand: true,
				cwd: srcPath+'/app/modules',
				// src: ['**/*.js'],
				src: ['mosapp.js','main.conf.php'],
				dest: buildPath+'/'+staticPath+'/app'
			},
			json: {
				expand: true,
				cwd: srcPath,
				src: ['json/**/*.json', 'json/**/*.php','json/**/*.pdf', '!unused/**/*.json'],
				dest: buildPath+'/'+staticPath,
				filter: 'isFile'
			},
			// favicon: {
			// 		expand: true,
			// 		cwd: srcPath+'/favicon',
			// 		src: ['**/*.*'],
			// 		dest: buildPath+'/'+staticPath+'/favicon',
			// 		filter: 'isFile'
			// },
			css: {
				expand: true,
				cwd: srcPath+'/css',
				src: ['**/*.min.css'],
				dest: buildPath+'/'+staticPath+'/css',
				filter: 'isFile'
			},
			// html: {
			// 		expand: true,
			// 		cwd: srcPath,
			// 		src: ['**/*.html', '!app/**/*.html', '!templates/**/*.html'],
			// 		dest: buildPath+'/'+staticPath,
			// 		filter: 'isFile'
			// },
			html: {
				expand: true,
				cwd: srcPath+'/templates',
				src: ['**/*.html'],
				dest: buildPath,
				filter: 'isFile'
			},

			uploads: {
				expand: true,
				cwd: srcPath+'/uploads',
				src: ['**/*.*'],
				dest: buildPath+'/'+staticPath+'/uploads'
			},
			fonts: {
				expand: true,
				cwd: srcPath+'/fonts',
				src: ['**/*.*'],
				dest: buildPath+'/'+staticPath+'/fonts'
			},

			imagecopy: {
				expand: true,
				cwd: srcPath,
				src: ['images/**/*.{png,jpg,jpeg,gif,svg,ico}'],
				dest: buildPath+'/'+staticPath,
				filter: 'isFile'
			},
			i18ncopy: {
				options: {
					process: function(src, filepath) {
						return src.replace(/,/,"");
					},
				},
				expand: true,
				cwd: tmpPath,
				src: ['i18n/**/*.*'],
				dest: buildPath+'/'+staticPath,
				filter: 'isFile'
			},
			// imagesvgcopy: {
			// 		expand: true,
			// 		cwd: srcPath,
			// 		src: ['images/**/*.svg'],
			// 		dest: buildPath+'/'+staticPath,
			// 		filter: 'isFile'
			// },
			iconcopy: {
				expand: true,
				cwd: srcPath+'/icons/grunticon',
				src: ['**/*.*'],
				dest: buildPath+'/'+staticPath+'/icons',
				filter: 'isFile'
			},
			templatescopy: {
				expand: true,
				cwd: srcPath+'/templatescopyonly',
				src: ['**/*.*'],
				dest: buildPath,
				filter: 'isFile'
			},
			templatescopytoroot: {
				expand: true,
				cwd: srcPath+'/templatescopytoroot',
				src: ['**/*.*'],
				dest: buildPath,
				filter: 'isFile'
			},
			version: {
				expand: true,
				cwd: srcPath,
				src: ['version.txt'],
				dest: buildPath
			}
		},


		connect: {
			options: {
				base: destinationPath,
				port: process.env.PORT || 8000
			},
			// server: {},
			development: {
				options: {
					keepalive: grunt.option('keepalive'),
					middleware: function (connect, options) {
						var middlewares = [];

						// RewriteRules support
						middlewares.push(rewriteModule.getMiddleware([

							// moved
							{from: '^/feedback(\/?)(.*)$', to: '/index.html#!/$1'},

						], {verbose: true}));

						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						var directory = options.directory || options.base[options.base.length - 1];
						options.base.forEach(function (base) {
							// Serve static files.
							middlewares.push(connect.static(base));
						});

						// Make directory browse-able.
						middlewares.push(connect.directory(directory));

						var f;
						proxyOptions = require('url').parse('http://localhost:8000/');
						proxyOptions.route = '/front/markup/feedback/';
						middlewares.push(proxy(proxyOptions));

					
						proxyOptions = require('url').parse(testServer+'/front/markup/layout');
						proxyOptions.route = '/front/markup/layout';
						middlewares.push(proxy(proxyOptions));

						proxyOptions = require('url').parse(testServer+'/static');
						proxyOptions.route = '/static';
						middlewares.push(proxy(proxyOptions));
						return middlewares;
					}
				}
			}

		},

		// livereload: {
		// 	options: {
		// 		livereload: true
		// 	},
		// 	files: ['build/**/*']
		// },


		chokidar: {
			options: {
				// spawn: false,
				dateFormat: function (ms) {
					var now = new Date(),
						time = now.toLocaleTimeString(),
						day = now.getDate(),
						month = now.getMonth() + 1,
						year = now.getFullYear();

					if (day < 10) {
						day = '0' + day;
					}

					if (month < 10) {
						month = '0' + month;
					}

					grunt.log.subhead(
						'Completed in ' + Math.round(ms) + 'ms at ' + time + ' ' +
						day + '.' + month + '.' + year + '.\n' +
						'Waiting for more changes...'
					);
				},
				// livereload: true,
				// interval: 5007
			},

			configFiles: {
				options: {
					// reload:  true
				},
				files: ['.csscomb.json', 'Gruntfile.js', 'package.json'],
				tasks: ['newer:jshint:configFiles']
			},
			imagecopy: {
				files: [srcPath+'/images/**/*.{png,jpg,gif,svg}'],
				tasks: ['newer:copy:imagecopy']
			},
			i18n: {
				files: [srcPath+'/app/directives/**/*.i18n'],
				tasks: ['newer:concat:i18nconcat','newer:copy:i18ncopy']
			},
			iconcopy: {
				files: [srcPath+'/icons/grunticon/**/*.*'],
				tasks: ['newer:copy:iconcopy']
			},
			version: {
				files: [srcPath+'/version.txt'],
				tasks: ['newer:copy:version']
			},
			jsoncopy: {
				files: [srcPath+'/**/*.json',srcPath+'/**/*.pdf',srcPath+'/json/**/*.php'],
				tasks: ['newer:copy:json']
			},
			// icocopy: {
			// 	files: [srcPath+'favicons/**/*.*'],
			// 	tasks: ['newer:copy:favicon']
			// },
			csscopy: {
				files: [srcPath+'/**/*.min.css'],
				tasks: ['newer:copy:css']
			},
			htmlcopy: {
				files: [srcPath+'/templates/**/*.html'],
				tasks: ['newer:copy:html']
			},

			templatescopy: {
				files: [srcPath+'/templatescopyonly/**/*.*'],
				tasks: ['newer:copy:templatescopy']
			},
			onrequestjs: {
				files: [srcPath+'/js/onrequest/**/*'],
				tasks: ['newer:copy:onrequestjs']
			},
			// grunticon: {
			// 	files: [tmpPath+'/icons/**/*.{svg,png}'],
			// 	tasks: ['newer:grunticon:myIcons']
			// },

			sasscommon: {
				files: [srcPath+'/css/**/*.scss'],
				tasks: [
					'newer:sass:dist',
					'newer:autoprefixer:dist',
					'newer:combine_mq:dist',
					'newer:cssmin:dist'
				]
			},
			sassapp: {
				files: [srcPath+'/app/**/*.scss'],
				tasks: [
					'newer:concat:cssapp',
					'newer:sass:app',
					'newer:autoprefixer:app',
					'newer:combine_mq:app',
					'newer:cssmin:app'
				]
			},
			pugdist: {
				files: [srcPath+'/templates/**/*.jade',srcPath+'/static/templates/**/*.jade'],
				tasks: ['newer:pug:dev']
			},
			pugapp: {
				files: [srcPath+'/app/**/*.jade'],
				tasks: ['newer:pug:app']
			},
			html2js: {
				files: [tmpPath+'/tpl/directives/**/*.tpl.html'],
				tasks: ['newer:html2js', 'newer:concat:jsapp']
			},
			uglifydist: {
				files: [buildPath+'/'+staticPath+'/js/script.js'],
				tasks: ['newer:uglify:dist']
			},
			uglifyapp: {
				files: [buildPath+'/'+staticPath+'/app/**/*.js', '!'+buildPath+'/'+staticPath+'/app/**/*.min.js'],
				tasks: ['newer:uglify:app']
			},

			appscripts: {
				files: [srcPath+'/app/directives/**/*.js'],
				tasks: ['newer:jshint:appdir', 'newer:concat:jsapp']
			},

			appconfig: {
				files: [srcPath+'/app/modules/*.js'],
				tasks: ['newer:jshint:appmod', 'newer:copy:mosapp']
			},
			appserv: {
				files: [srcPath+'/app/services/*.js'],
				tasks: ['newer:jshint:appsrv', 'newer:concat:jsapp']
			},

			scripts: {
				files: [srcPath+'/js/user/**/*.js'],
				tasks: ['newer:jshint:dist', 'newer:concat:js']
			},
			libscripts: {
				files: [srcPath+'/js/common/**/*.js'],
				tasks: ['newer:concat:jslib1','newer:concat:jslib2','newer:concat:jslib3']
			}

		}




	});
	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	grunt.loadNpmTasks('grunt-chokidar');
	grunt.registerTask('watch', ['chokidar']);

	grunt.registerTask('common', [
	]);

	grunt.registerTask('default', [
		'server',
		'clean:dist',
		'copy:dependencies',
		'pug:app',
		//'pug:tilda',
		'pug:dev',
		'html2js',
		'jshint:configFiles',
		'concat:jsapp',
		'concat:js',
		'concat:jslib1',
		'concat:jslib2',
		'concat:jslib3',
		'concat:cssapp',
		'sass:app',
		'sass:dist',
		'autoprefixer:app',
		'autoprefixer:dist',
		'combine_mq:app',
		'combine_mq:dist',
		'cssmin:app',
		'cssmin:dist',
		'concat:i18nconcat',
		'copy:i18ncopy',
		'uglify:dist',
		'uglify:app',
		//'copy:tilda',
		'copy:onrequestjs',
		'copy:mosapp',
		'copy:json',
		// 'copy:favicon',
		'copy:html',
		'copy:css',
		'copy:uploads',
		'copy:fonts',
		'copy:imagecopy',
		'copy:iconcopy',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		// 'gitclone',
		'copy:dependencies',
		'pug:app',
		//'pug:tilda',
		'pug:build',
		'html2js',
		'jshint:dist',
		'jshint:appdir',
		'jshint:appmod',
		'jshint:appsrv',
		'jshint:configFiles',
		'concat:jsapp',
		'concat:cssapp',
		'concat:js',
		'concat:jslib1',
		'concat:jslib2',
		'concat:jslib3',
		'sass:app',
		'sass:dist',
		'autoprefixer:app',
		'autoprefixer:dist',
		'combine_mq:app',
		'combine_mq:dist',
		'cssmin:app',
		'cssmin:dist',
		'concat:i18nconcat',
		'copy:i18ncopy',
		'uglify:dist',
		'uglify:app',
		//'copy:tilda',
		'copy:onrequestjs',
		'copy:mosapp',
		'copy:json',
		// 'copy:favicon',
		'copy:html',
		'copy:css',
		'copy:uploads',
		'copy:fonts',
		'copy:version',
		'copy:templatescopy',
		'copy:templatescopytoroot',
		'copy:imagecopy',
		'copy:iconcopy',
		'string-replace:version',
		// 'string-replace:base',
		'clean:final'
	]);

	grunt.registerTask('server',[
		'connect'
	]);

	grunt.registerTask('serve',[
		'build',
		'server',
		'watch:options'
	]);

};
