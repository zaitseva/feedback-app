'use strict';
var grunt = require('grunt');

var dirPath = 'src/app/directives/';
var tmpPath = 'tmp/tpl/directives/';
var html2jsPath = 'tmp/tpl/directives/';
var srvPath = 'src/app/services/';
var buildPath = 'dist/static/app/';
var scssPath = 'tmp/appcss/scss/';
var i18nPath = 'tmp/i18n/';
var i18n_lng = ['ru','en']; // языковая поддержка
module.exports = {


	wrapJS: function(src, name){
		var dist = {};
		Object.keys(src).forEach(function(key) {
			var jsArr = [];
			for (var i=0; i<src[key].length; i++){
				jsArr.push(dirPath+src[key][i]+'/**/*.js')
			}
			jsArr.push(srvPath+'**/*.js');
			jsArr.push(html2jsPath+key+'.tpl.js');
			dist[buildPath+key+'/'+key+'.js'] = jsArr;
		});
		return dist;
	},

	wrapI18N: function(src, name){
		var dist = {};
		Object.keys(src).forEach(function(key) {
			var lng=i18n_lng.length;
			while(lng--) {
				var i18n = [];
				for (var i=0; i<src[key].length; i++){
					i18n.push(dirPath+src[key][i]+'/i18n/'+i18n_lng[lng]+'.i18n')
				}
				dist[i18nPath+key+'/'+i18n_lng[lng]+'.json'] = i18n;
			}
		});
		// console.log("dist");
		// console.log(dist);
		return dist;
	},


	wrapCSS: function(src, name){
		var dist = {};
		Object.keys(src).forEach(function(key) {
			var cssArr = [];
			for (var i=0; i<src[key].length; i++){
				cssArr.push(dirPath+src[key][i]+'/**/*.scss')
			}
			dist[scssPath+key+'/'+key+'.scss'] = cssArr;
		});
		// console.log(dist);
		return dist;
	},


	html2js: function(src){
		var dist = {};
		Object.keys(src).forEach(function(key) {
			var obj = {};
			obj.options = {
				module: key+'.templates',
				base: tmpPath,
				singleModule: true
			}
			var files = [];
			for (var i=0; i<src[key].length; i++){
				files.push(tmpPath+src[key][i]+'/**/*.tpl.html');
			}
			obj.src = files;
			obj.dest = html2jsPath+key+'.tpl.js';

			dist[key] = obj;
		});
		// console.log(dist);
		return dist;
	}

};
