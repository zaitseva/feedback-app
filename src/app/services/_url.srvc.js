/*
 * UrlSrvc - сервис обработки url
 */
angular.module('mosapp').service('UrlSrvc', ['mosconfig', 'LangSrvc', '$rootScope', function (mosconfig, LangSrvc,  $rootScope) {

	$rootScope.$on('$stateChangeSuccess', function () {
		try {
			setTimeout(window.$mos_layouts.api.setActive,0);
		} catch(e) {
			console.warn('$mos_layouts is undefined. Something wrong with markup_layouts.', e);
		}
	});

	this.getMainDomain = function getMainDomain(){
		var server = '';
		if (mosconfig.domain) {
			server = ((mosconfig.domain.indexOf('http')===0) ? '' : location.protocol +'//') + mosconfig.domain;
			server = server.replace(new RegExp("\/$"),'');
		}
		return server;
	};



	this.getLangLink= function (link) {
		var lng = LangSrvc.getCurrentLang();
		if (lng == 'ru') {
			return link;
		}
		return '/' + lng + link;
	};
	this.getLangLinkPrefix = function () {
		var lng = LangSrvc.getCurrentLang();
		if(lng == 'ru') {
			return '';
		}
		return '/' + lng;
	};

	/*
	 * UrlSrvc.tmplPath(path) - возвращает путь к шаблону с учетом папки, в которой шаблоны размещаются
	 * т.к. все шаблоны хранятся в js/app.templates.js и пути к ним вирутальные - путь надо менять
	 * только при внесении изменений в настройки сборки Gruntfile.js:html2js
	 */
	this.tmplPath = function (path) {
		var updatedPath = path;
		return updatedPath;
	};
	/*
	 * UrlSrvc.apiPath(name, params) - возвращает путь к api с параметрами
	 * name - имя api
	 * params - параметры
	 */
	this.apiPath = function (name, params) {
		return mosconfig.restAPI[name];
	};

	/*
	 * UrlSrvc.jsPath(path) - возвращает путь к скрипту в папке js, когда ее расположение
	 * на сервере отличается от пути в верстке
	 */
	this.jsPath = function (path) {
		var updatedPath = (mosconfig.jsPath || '') + path;
		return updatedPath.replace(new RegExp("//", 'g'), '/');
	};

	/*
	 * UrlSrvc.cssPath(path) - возвращает путь к скрипту в папке css, когда ее расположение
	 * на сервере отличается от пути в верстке
	 */
	this.cssPath = function (path) {
		var updatedPath = (mosconfig.cssPath || '') + path;
		return updatedPath.replace(new RegExp("//", 'g'), '/');
	};

	/*
	 * UrlSrvc.pagePath(mod, path) - возвращает путь к страницам разделов сайта,
	 * например - к новости в прессцентре
	 *
	 */
	this.pagePath = function (mod, path) {
		var updatedPath = (mosconfig.pagePath[mod] || '') + path;
		return updatedPath.replace(new RegExp("//", 'g'), '/');
	};

	/*
	 * UrlSrvc.linksPath(path) - возвращает путь к внешним ссылкам
	 *
	 */
	this.linksPath = function (path) {
		return mosconfig.linksPath[path];
	};

	/*
	 * UrlSrvc.specialType() - возвращает типы спецвыдачи
	 *
	 */
	this.specialType = function (mod) {
		var updatedTypes = (mosconfig.specialType[mod] || '');
		return updatedTypes;
	};

	/*
	 * UrlSrvc.currentEmergency() - возвращает флаг
	 * UrlSrvc.currentBanner() - возвращает флаг для баннера
	 */

	this.currentEmergency = function (mod) {
		if (!mod && !mosconfig.emergency) {
			return;
		}
		var updatedEmergency = (mosconfig.emergency[mod] || '');
		return updatedEmergency;
	};
	// this.currentBanner = function(mod){
	// 	var updatedEmergency = (mosconfig.banner[mod] || '');
	// 	return updatedEmergency;
	// };

	this.currentEmergencyPath = function (mod) {
		if (!mod && !mosconfig.emergency && !mosconfig.emergency.path) {
			return;
		}
		var updatedEmergencyPath = (mosconfig.emergency.path[mod] || '');
		return updatedEmergencyPath;
	};
	/**
	 * Функция возвращает домен, путь к api и массив с кодами рекламных площадок
	 * @param param - Ключ по которому возвращаются баннеры
	 * @param lang - Для какой языковой версии баннеры. 'ru' - default
	 * @returns {{domain: string, urlPath: string, items: *}}
	 */
	this.getBanners = function (param, lang) {
		if (!param && !mosconfig.banners && !mosconfig.banners[param]) {
			return;
		}
		if (!lang) {
			lang = LangSrvc.getCurrentLang();
		}
		return {
			'domain': mosconfig.banners.domain,
			'urlPath': mosconfig.banners.urlPath,
			'items': mosconfig.banners[param][lang]
		}
	}
}])

/*
 pathSrvc - разбор url для страницы результатов поиска и поисковой формы
 */
	.service('pathSrvc', [function () {
		this.parsePath = function parsePath(pathstr) {
			var res = {
				"filter": {"value": "", "result": "error"},
				"page": {"value": 0, "result": "error"},
				"query": {"value": "", "result": "error"},
				"errors": 0
			};
			var err = 0;
			var path = '';
			try {
//			path = decodeURI(window.location.hash).replace('#\/','');
				path = decodeURI(pathstr);
			} catch (e) {
				path = 'f/common/p/1/q/';
				res.errors = 100500;
			}

			if (angular.isString(path)) {
				path = path.split('\/');
				if (path[0] === '') {
					path.splice(0, 1);
				}

				if (path[0] === 'f' && path[1] !== '') {
					res.filter = {"value": path[1], "result": "ok"};
				} else {
					res.filter = {"value": path[1], "result": "error"};
					res.errors++;
				}
				if (path[2] === 'p' && !isNaN(path[3])) {
					res.page = {"value": parseInt(path[3]), "result": "ok"};
				} else {
					res.page = {"value": path[3], "result": "error"};
					res.errors++;
				}
				if (path[4] === 'q') {
					path[5] = path[5].replace(new RegExp("%2F", 'g'), '/');
					res.query = {"value": path[5], "result": "ok"};
				} else {
					res.query = {"value": path[6], "result": "error"};
					res.errors++;
				}
			}
			return res;
		};
	}]);


angular.module('mosapp').filter('imagesPath', ['mosconfig', function (mosconfig) {
	return function (src) {
		return ((mosconfig.imagesPath || '') + src).replace(new RegExp("//", 'g'), '/');
	};
}]);


angular.module('mosapp').run(["$state", '$stateParams', '$window', function ($state, $stateParams, $window) {

	function contrastTriggerFn() {
		if (angular.isObject($state)) {
			try {
				$state.transitionTo($state.current, $stateParams, {
					reload: true,
					inherit: false,
					notify: true
				});
			} catch (e) {
				window.location = window.location.href;
				return false;
			}
		} else {
			window.location = window.location.href;
		}
	}

	if ($window.addEventListener) {
		$window.addEventListener('contrastTrigger', contrastTriggerFn);
	} else {
		$window.attachEvent('on' + 'contrastTrigger', function () {
			contrastTriggerFn.call($window);
		});
	}

}]);
/**
 * возвращает выбранную версию языка
 * Так же ставит флаг о переключении языка. Ключик используется футером и шапкой как сигнал о том что нужно загрузить актуальные данные
 * Провайдер потому что сервис нельзя корректно ижектнуть в конфиг
 */
angular.module('mosapp').provider('LangSrvc', function () {
	var lng = false;
	function setLocalStorage (lang, changed) {
		try{
			localStorage.setItem("lng",lang);
			localStorage.setItem("lngChanged",changed);
		}
		catch(e){
			return false
		}
	}
	/**
	 * Вызывается самым первым, при установке предпочитаемого языка
	 * @returns {*}
	 */
	this.setCurrentLang =  function () {
		if (!lng) {
			lng = document.documentElement.lang;
			lng = lng ? lng : 'ru';
			if (!localStorage['lng'] || localStorage['lng'] !== lng) {
				setLocalStorage(lng, true);
			} else {
				setLocalStorage(lng, false);
			}
		}
		return lng;
	};
	this.$get = function () {
		return {
			getCurrentLang: function () {
				return lng;
			}
		}
	}
});
