angular.module('mosapp')
.value('apiQueue', [])
.value('lastReq', false)
.service('apiSrvc', [
			'UrlSrvc',	'$http',	'$q',	'transformRequestAsFormPost',	'apiQueue',	'$timeout',	"loader",	"lastReq", "LangSrvc",
	function(UrlSrvc,	$http,		$q,		transformRequestAsFormPost,		apiQueue,	$timeout,	loader,		lastReq, LangSrvc){


	function endOfRequest() { // вызывается каждый раз после получения любого ответа от сервера на запрос
		if (lastReq) { // это был последний запрос в очереди
			lastReq = false;
			// console.log('endOfRequests');
			$timeout(function(){
				if (typeof window.callPhantom === 'function') {
					window.callPhantom({"queue":"isempty"});
				}
			}, 100);
		}
	}


	function apiGetRequest(req){

		$http({
			url: req.url,
			method: "GET",
			params: req.params
		}).success(
			function(data, status){
				if (req.showError && data.error) {
					var errorMessage = {
						title: 'Ошибка получения данных из API.',
						content: data.description,
						placement: 'top',
						type: 'warning',
						show: true
					};
					data.errorMessage = errorMessage;
				}
				loader.switchOff(req.loaderEl);
				endOfRequest();
				req.resolve(data, status);
			}
		).error(
			function(data, status){
				// console.log(data)
				// console.log(status)
				loader.switchOff(req.loaderEl);
				endOfRequest();
				var err = {
					content:data,
					code:status
				};
				req.reject(err);
			}
		);
	}

	function apiPostRequest(req){
		$http({
			url: req.url,
			transformRequest: transformRequestAsFormPost,
			method: "POST",
			data: req.params
		}).success(
			function(data, status){
				if (req.showError && data.error) {
					var errorMessage = {
						title: 'Ошибка получения данных из API.',
						content: data.description,
						placement: 'top',
						type: 'warning',
						show: true
					};
					data.errorMessage = errorMessage;
				}
				loader.switchOff(req.loaderEl);
				endOfRequest();
				req.resolve(data);
			}
		).error(
			function(data, status){
				loader.switchOff(req.loaderEl);
				endOfRequest();
				var err = {
					content:data,
					code:status
				};
				req.reject(err);
			}
		);
	}


/*
* Очередь GET-запросов к апи
* обращения из директив сохраняют запросы в массиве очереди
* sendRequestFromQueue разбирает массив и отправляет запросы
*
*
*
*
*
*/

	this.sendRequestFromQueue = function sendRequestFromQueue(){

		var newT = Math.floor((Math.random() * 200) + 25);
// console.log("newT "+newT);
// console.log(apiQueue.length);
		if (apiQueue.length > 0) {
			var req = {};
			// angular.copy(apiQueue[0], req); // does not work with element Node
			angular.forEach(apiQueue[0], function(val, key) {
				req[key] = apiQueue[0][key];
			});

			switch(req.method) {
				case "POST" :
					apiPostRequest(req);
				break;
				default:
					apiGetRequest(req);
				break;
			}
			apiQueue.shift();

			if (apiQueue.length===0) {
				lastReq = true;
// console.log('Last item in the queue!');
			}
		}
		$timeout(sendRequestFromQueue, newT);
	};


	var startTime = new Date();
	this.sendRequestFromQueue();



/*
* configError обработка ошибок в конфиге: отсутствие ключей сервиса и апи
*
*/
	function configError(key, resolve, reject, loaderEl) {
		console.error("Object '"+key+"' not found! Check config, please.");
		loader.switchOff(loaderEl);
		if (typeof reject === 'function') {
			reject({error:"Object '"+key+"' not found! Check config, please."});
		} else {
			resolve({error:"Object '"+key+"' not found! Check config, please."});
		}
		return false;
	}


/*
*
*
*/
	function prepareString(apiparams) {
/*
		angular.forEach(apiparams, function(val,key){
			if (angular.isString(val)) {
				// // val = encodeURIComponent(val);
				// apiparams[key] = val.replace(/\s/g, '%20');
			}
		});
*/
		return apiparams;
	}


/*
* Запросы к серверу apiSrvc.getData(mod, api, params);
* mod - название app-модуля ('main', 'press'..)
* api - тип сервиса из массива
*	'mosconfig', {
*		'restAPI': {
*			'press': {
*				api...
*			}
*		}
*	}
* params - search-параметры GET запроса
*
*/

	this.getData = function(mod, api, params, showError, loaderEl){
		// console.log(loaderEl)
		return $q(function(resolve, reject) {
			loader.switchOn(loaderEl);
			var apiparams = angular.copy(params);



			var url = UrlSrvc.apiPath(mod);
			if (!angular.isObject(url)) {
				return configError(mod, resolve, reject, loaderEl);
			}
			url = url[api];
			if (!url) {
				return configError(mod+"."+api, resolve, reject, loaderEl);
			}


			if (angular.isObject(apiparams)) {
				apiparams = prepareString(apiparams);
			}

			url = placeParamsInUrl(url, apiparams);

			var queueItem = {
							"method":		"GET",
							"url":			url,
							"resolve":		resolve,
							"reject":		reject,
							"params":		apiparams,
							"showError":	showError,
							"loaderEl":		loaderEl
						};
			apiQueue.push(queueItem);
		});
	};

	this.getDataByUrl = function(url, params, showError, loaderEl){
		// console.log(loaderEl)
		return $q(function(resolve, reject) {
			loader.switchOn(loaderEl);
			var apiparams = angular.copy(params);

			if (!url) {
				return configError(url, resolve, reject, loaderEl);
			}

			if (angular.isObject(apiparams)) {
				apiparams = prepareString(apiparams);
			}

			url = placeParamsInUrl(url, apiparams);

			var queueItem = {
							"method":		"GET",
							"url":			url,
							"resolve":		resolve,
							"reject":		reject,
							"params":		apiparams,
							"showError":	showError,
							"loaderEl":		loaderEl
						};
			apiQueue.push(queueItem);
		});
	};


/*
* Запросы к серверу apiSrvc.postData(mod, api, params);
* mod - название app-модуля ('main', 'press'..)
* api - тип сервиса из массива
*	'mosconfig', {
*		'restAPI': {
*			'press': {
*				api...
*			}
*		}
*	}
* params - search-параметры GET запроса
*
*/

	this.postData = function(mod, api, params, showError, loaderEl){
		return $q(function(resolve, reject) {
			loader.switchOn(loaderEl);
			var apiparams = angular.copy(params);

			var url = UrlSrvc.apiPath(mod);
			if (!angular.isObject(url)) {
				return configError(mod, resolve, reject, loaderEl);
			}
			url = url[api];
			if (!url) {
				return configError(mod+"."+api, resolve, reject, loaderEl);
			}

			url = placeParamsInUrl(url, apiparams);

			var queueItem = {
							"method":		"POST",
							"url":			url,
							"resolve":		resolve,
							"reject":		reject,
							"params":		apiparams,
							"showError":	showError,
							"loaderEl":		loaderEl
						};
			apiQueue.push(queueItem);
		});
	};

	function placeParamsInUrl(url, params) {
		var killArray = [];
		angular.forEach(params, function(value, key){
			if (url.indexOf('\%'+key+'\%') > -1) {
				url = url.replace('\%'+key+'\%',value);
				if (killArray.indexOf(key)<0) {
					killArray.push(key);
				}
			}
		});
		for (var i=0; i<killArray.length; i++) {
			delete params[killArray[i]];
		}

		// add lang support
		if (url.indexOf('\[lang\]') > -1) {
			url = url.replace('\[lang\]', LangSrvc.getCurrentLang());
		}
		return url;
	}

}]).factory("transformRequestAsFormPost", function() {
	// I prepare the request data for the form post.
	function transformRequest( data, getHeaders ) {
		var headers = getHeaders();
		headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
		return (serializeData(data));
	}
	// Return the factory value.
	return (transformRequest);
	function serializeData(data) {
		// If this is not an object, defer to native stringification.
		if (!angular.isObject(data)) {
			return((data === null)? "" : data.toString());
		}
		var buffer = [];
		// Serialize each key in the object.
		for (var name in data) {
			if (!data.hasOwnProperty(name)) {
				continue;
			}
			var value = data[name];
			buffer.push(
				encodeURIComponent(name) +
				"=" +
				encodeURIComponent((value===null)?"":value)
			);
		}
		var source = buffer.join("&").replace(/%20/g,"+");
		return (source);
	}
}).service('loader', [function(){

	this.switchOn = function(el){
		if (angular.element(el).length) {
			angular.element(el).addClass('rel');
			angular.element(el).prepend('<div class="loader"><div class="loader-image"><div class="cssload-progress cssload-float cssload-shadow"><div class="cssload-progress-item"></div></div></div></div>');
		}
	};

	this.switchOff = function(el){
		if (angular.element(el).length) {
			angular.element(el).removeClass('rel');
			angular.element(angular.element(el)[0].querySelectorAll('.loader')).remove();
		}
	};

}]);
