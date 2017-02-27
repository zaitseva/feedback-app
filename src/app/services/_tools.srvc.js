/*
* toolsSrvc - разные утилиты
*/
angular.module('mosapp').service('toolsSrvc', ['mosconfig', '$timeout', 'LangSrvc', 'UrlSrvc', function(mosconfig, $timeout, LangSrvc, UrlSrvc){
/*
* toolsSrvc.ruStrToDate(ddMMyyyy) - возвращает дату в формате Date()
*/
	var errorInfo;
	this.ruStrToDate = function ruStrToDate(ddMMyyyy){
		var retdate = false;
		if (angular.isString(ddMMyyyy)) {
			var ddMMyyyyArr = ddMMyyyy.split('.');
			if (ddMMyyyyArr.length > 2) {
				retdate = new Date(ddMMyyyyArr[2], ddMMyyyyArr[1]-1, ddMMyyyyArr[0]);
			}
		}
		return (retdate) ? retdate : ddMMyyyy;
	};

	this.fillOutPages = function fillOutPages(current,maxNum){
		var pages = [];
		for (var i=1; i<maxNum+1; i++) {
			pages.push({num:i});
		}
		return pages;
	};


	this.scrollTop = function scrollTop(speed){
		TweenLite.to(window, (speed || 0.75), {scrollTo:{y:0}, ease:Power2.easeOut,
			onComplete: function(){
		}});
	};

	this.colorScheme = function colorScheme(){
		return (localStorage.getItem("contrast") === "true") ? "contrast" : "default";
	};


	this.htmlToPlaintext = function htmlToPlaintext(text) {
		text = text ? String(text).replace(/\&\w{4,5};/gm, ' ') : '';
		return text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};

	this.setMeta = function(scope, data, key) {
			var path = '';
		path = UrlSrvc.getMainDomain();
		var image = (scope.image && scope.image !== '' && scope.image.indexOf('data:image', 0) < 0) ? scope.image : (mosconfig.imagesPath || '') + 'favicon/icon200x200.png';
		image = (image.indexOf('http')===0)? image : path + '/'+image.replace(new RegExp("^\/"),'');

		$timeout(function(){
				$('meta[property="og:url"]').attr('content', path + '/' + location.pathname.replace(new RegExp("^\/"),''));
		}, 500);

		if (key && data[key]) {
			$('meta[property="og:title"]').attr('content', this.htmlToPlaintext(data[key].title));
			$('meta[property="og:description"]').attr('content', this.htmlToPlaintext(data[key].description));
		}
		$('meta[property="og:image"]').attr('content', image);
		$('meta[property="og:image:url"]').attr('content', image);
	};

	this.setTitle = function setTitle() {
		var curLang = LangSrvc.getCurrentLang();
		var conf = mosconfig.titleParams || {},
			sep = conf.separator || ' / ',
			site = conf.siteName[curLang] || 'Сайт Москвы',
			arg =[];
		for (var i=0; i<arguments.length; i++) {
			arg.push(this.htmlToPlaintext(arguments[i]));
		}

		var	collection =Array.prototype.slice.call(arg, 0);

		collection.push(site);

		$('title').text(collection.join(sep));
		//console.log('set title: '+collection.join(sep));
	};
	this.setKeywords = function setKeywords(data) {
			if(data && data!=''){
				var meta = document.createElement('meta');
				meta.name = "keywords";
				meta.content = data;
				document.getElementsByTagName('head')[0].appendChild(meta);
			}
		};

	this.togglerBlackAndWhite = function togglerBlackAndWhite(selector, flag) {
		if (flag === 'contrast') {
			$(selector).addClass('grayscale');
			$('.grayscale-img').addClass('grayscale');
			$('.grayscale').gray();
		} else {
			$('.grayscale').toggleClass('grayscale-off');
			$(selector).removeClass('grayscale');
			$('.grayscale-img').removeClass('grayscale');
		}
	};

	this.prepareTags = function prepareTags(data) {
		var paramsCollection = [];

		if (angular.isString(data)){
			return data;
		}
		if (angular.isArray(data)) {
			data.forEach(function(item) {
				paramsCollection.push(item.title);
			});
			// return encodeURIComponent(paramsCollection.join(", "));
			return paramsCollection.join(", ");
		}
	};

	// ошибки
	this.setErrorInfo = function setErrorInfo(data) {
		errorInfo = data;
	};

	this.getErrorInfo = function getErrorInfo() {
		return errorInfo;
	};




	this.statCounter = function statCounter(params) {

		var maxAttempts = 20;

		function trySendMetrika(COUNTER_ID, TARGET_NAME, cnt) {
			var js = "yaCounter"+COUNTER_ID+".reachGoal('"+TARGET_NAME+"');"
			try {
				eval(js);
				// console.info("OK metrika with: "+TARGET_NAME);
			} catch (e) {
				cnt ++;
				if (cnt < maxAttempts) {
					$timeout(function(){
						trySendMetrika(COUNTER_ID, TARGET_NAME, cnt);
					}, 500);
				}
				// console.warn("metrika trouble with: "+TARGET_NAME);
			}
		}

		if (angular.isObject(params)) {
			// яндекс метрика
			if (angular.isObject(params.metrika) && params.metrika.TARGET_NAME) {
				var COUNTER_ID, TARGET_NAME = (angular.isObject(params.metrika) && params.metrika.TARGET_NAME) ? params.metrika.TARGET_NAME : null;
				try {
					COUNTER_ID = mosconfig.stat.metrika.id;
				}catch(e){
				}
				if (COUNTER_ID && TARGET_NAME) {
					trySendMetrika(COUNTER_ID, TARGET_NAME, 0);
				}
			}
		}
	};
}]);
