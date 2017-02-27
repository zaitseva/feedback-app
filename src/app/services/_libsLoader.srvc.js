
angular.module('mosapp').service('libsLoader',['UrlSrvc', '$q', '$window', function(UrlSrvc, $q, $window){
	var LibsHash = {};
	/**
	 * params.js: path to js file
	 * params.css: path to css file
	 * params.id: name of library to store in srvc.
	 * params.api: global variable that created by script
	 * @param params
	 */
	this.get = function (params) {
		if(typeof LibsHash[params.id] === 'undefined') {
			var lib = {};

			if(params.js) {
				lib.js = $q(function(resolve, reject) {
					lib.status = 'load';
					var script;
					if(params.js) {
						script = document.createElement('script');
						script.id = params.id;
						script.async = 'true';
					}
					document.getElementsByTagName('head')[0].appendChild(script);
					script.src = UrlSrvc.jsPath(params.js);
					$(script).on('load', function() {
						if(params.api) {
							lib.api = $window[params.api];
						}
						lib.status = 'ready';
						resolve(lib);
					});
				});
			}

			LibsHash[params.id] = lib;

			if(params.css) {
				var css = document.createElement('link');
				css.rel = 'stylesheet';
				css.href = UrlSrvc.jsPath(params.css);
				css.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(css);
			}
		}
		return LibsHash[params.id]
	}
}]);
