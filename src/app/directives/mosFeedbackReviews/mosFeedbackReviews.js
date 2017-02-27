angular.module('mos.feedback.reviews', ['ngSanitize'])
.filter('startFrom', function() {
    return function(input, start) {
        return input.slice(start);
}
})
.directive('mosFeedbackReviews', ['UrlSrvc', 'apiSrvc', '$modal', '$timeout', 'toolsSrvc', 'metaConfig', 'mosconfig', 'libsLoader', '$locale', '$window','$translate', '$rootScope',
		function (UrlSrvc, apiSrvc, $modal, $timeout, toolsSrvc, metaConfig, mosconfig, libsLoader, $locale, $window, $translate, $rootScope) {
			return {
				restrict: 'AE',
				scope: {},
				link: function link(scope, element, attrs, controller) {



					var popup;
					var fillHeight;
					var _scrollTop;
					var cancelShowHandler;
					var cancelHideHandler;
					// scope.lock=false;


					toolsSrvc.setMeta(scope, metaConfig.config, 'reviews');
					toolsSrvc.setTitle(metaConfig.config.reviews.section);

					element.on('$destroy', function() {
						angular.element(window).off('resize', toCenter);

						if (typeof cancelShowHandler === 'function') {
							cancelShowHandler();
						}
						if (typeof cancelHideHandler === 'function') {
							cancelHideHandler();
						}
					});

					scope.openPdf = openPdf;
					scope.year = [];

					// Слушатели событий попапа
					cancelShowHandler = $rootScope.$on('mosFeedbackReviews.show', function(e, modal) {
						_scrollTop = window.pageYOffset || document.body.scrollTop;
						document.body.style.position = 'fixed';
						document.body.style.top = -_scrollTop + 'px';
						document.body.style.width = '100%';
					});

					cancelHideHandler = $rootScope.$on('mosFeedbackReviews.hide', function(e, modal) {
						document.body.style.position = '';
						document.body.style.width = '';
						document.body.style.top = '';
						document.body.scrollTop = _scrollTop;
					});

					function renderQuarter(){
						var qr = [];
					angular.forEach([0,1,2,3], function(value, key) {
						var object = {};

						$translate(['mosFeedbackReviews.quarter.' + value]).then(function(translations) {
							 object.title = translations['mosFeedbackReviews.quarter.' + value];
						});
						 object.url = null;
						 object.date = '';

						qr.push(object);


					});
					return qr;
					}

					function renderMonth(){
						var month = [];
						angular.forEach([0,1,2,3,4,5,6,7,8,9,10,11], function(value, key) {
						var object = {};

						$translate(['mosFeedbackReviews.month.' + value]).then(function(translations) {
							 object.title = translations['mosFeedbackReviews.month.' + value];
						});
						 object.url = null;
						 object.date = '';

						month.push(object);


						});
					return month;
					}

					angular.forEach([2017,2016], function(value, key) {
						var object = {};
						$translate(['mosFeedbackReviews.year.' + value]).then(function(translations) {
							 object.title = translations['mosFeedbackReviews.year.' + value];
						});
						 object.url = null;
						 object.date = '';
						 object.quarters = renderQuarter();
						 object.months = renderMonth();
						 scope.year.push(object);

					});

					// ++ FIX for ie11 worker
					if (!$window.PDFJS) {
						$window.PDFJS = {
							verbosity:0
						};
					}
					if (!$window.PDFJS.workerSrc && typeof document !== 'undefined') {

						// workerSrc is not set -- using last script url to define default location
						$window.PDFJS.workerSrc = (function () {
							'use strict';
							var scriptTagContainer = document.body ||
													document.getElementsByTagName('head')[0];
							var pdfjsSrc = scriptTagContainer.lastChild.src;
							return pdfjsSrc && pdfjsSrc.replace(/\.js$/i, '.worker.js');
						})();
						$window.PDFJS.workerSrc = UrlSrvc.jsPath('pdfjs/minified/app/pdf.worker.js');
					}
					// -- FIX for ie11 worker


					libsLoader.get({
						js: 'pdfjs/minified/app/pdf.js',
						id: 'pdfjs.js',
						api: 'Pdfjs'
					});

					var params = {
						'group': 'year',
						'expand': 'items',
						'fields': 'year',
						'sort': '-year'
					}

						$timeout(function () {
						apiSrvc.getData('documents', 'feedbackReviews', params, true, element).then(
							function (res) {
								if (angular.isObject(res)) {
									for (var j = 0; j < res.items.length; j++) {
										renderLink(res.items[j].items, 1);
									}
								} else {
									scope.error = err;
									scope.mosError = 404;
								}
							},
							function (err) {
								scope.error = err;
								scope.mosError = 404;
							}
						);
							 }, 40);


					function renderLink(data, y) {
						angular.forEach(scope.year, function(value, key) {
							if(key == y){
								for (var i = 0; i < data.length; i++) {
									if (data[i].month == null && data[i].quarter == null) {
											scope.year[key].url = data[i].url;
											scope.year[key].date = data[i].date_published_timestamp;
									} else if (data[i].month == null) {
											scope.year[key].quarters[data[i].quarter-1].url = data[i].url;
											scope.year[key].quarters[data[i].quarter-1].date = data[i].date_published_timestamp;
									} else {
											scope.year[key].months[data[i].month-1].url = data[i].url;
											scope.year[key].months[data[i].month-1].date = data[i].date_published_timestamp;
									}
								}

							}

						});


					}



					function openPdf(url, date) {

						scope.date = date*1000;
						var modalScope = scope.$new();

						popup = $modal({
							scope: modalScope,
							template: 'mosFeedbackReviews/mosFeedbackPdf.tpl.html',
							prefixClass: 'share-modal',
							prefixEvent: 'mosFeedbackReviews',
							backdropAnimation: 'am-fade'
						});

						toCenter();

						angular.element(window).on('resize', toCenter);

						checkIfReady(url);

					}

					function checkIfReady(url) {
						if (angular.isObject($window.PDFJS)) {
							renderPdf(url);
						} else {
							$timeout(function () {
								checkIfReady(url);
							}, 100)
						}
					}

					function renderPdf(url) {
						$timeout(function () {
							scope.zoomScale = 1;
							scope.scale = Math.round(1 * 100) + '%';
							var shownPdf = null;
							var container = document.querySelector("#pdf_viewer");
							var docwrapper = $(".mos-feedback-reviews-pdf-wrap:eq(0)");
							scope.namePdf = url.substring(url.lastIndexOf('/')).substring(1);
							scope.urlPdf = url;
							PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
								if (!shownPdf) {
									shownPdf = pdf;
								}
								renderPage(pdf);
							});
							function renderPage(pdf, isZoom) {
								if (container.innerHTML != '' && !isZoom) {
									container.innerHTML = '';
									docwrapper.mCustomScrollbar('destroy');
								}
								// Loop from 1 to total_number_of_pages in PDF document
								var popupWidth = popup.$element.find('.mos-feedback-reviews-pdf').width();
								var scale = 1;
								var i = 1;
								while (i <= pdf.numPages) {
									// Get desired page
									pdf.getPage(i).then(function setPage(page) {
										if (page.pageIndex==0) { // расчет масштаба только для первой страницы
											if (isZoom) {
												scale = scope.zoomScale;
											} else if (popupWidth) {
												scale = (popupWidth - 15) / page.getViewport(1.0).width;// 15 - отступ для скроллбара
												scale = scale - ((scale * 100) % 5) / 100;
												scope.zoomScale = scale;
											}
											scope.scale = Math.round(scale * 100) + '%';
										}
										var viewport = page.getViewport(scope.zoomScale);

										if (isZoom) {
											var curPage = container.querySelector('#page-' + (page.pageIndex + 1));
											if (!curPage) {
												scope.lock=false;
												return;
											}
											var pageSvg = curPage.children[0];
											curPage.style.width = viewport.width + 'px';
											curPage.style.height = viewport.height + 'px';
											container.style.width = viewport.width + 'px';

											pageSvg.style.width = viewport.width + 'px';
											pageSvg.style.height = viewport.height + 'px';

											if (page.pageIndex === pdf.numPages - 1) {
												docwrapper.mCustomScrollbar('update');
												$timeout(function(){
													scope.lock=false;
												}, 50);
											}
											return;
										}

										var div = document.createElement("div");
										// Set id attribute with page-#{pdf_page_number} format
										div.id = 'page-' + (page.pageIndex + 1);
										// This will keep positions of child elements as per our needs
										div.style.position = 'relative';
										// Append div within div#container
										container.appendChild(div);
										div.style.width = viewport.width + 'px';
										div.style.height = viewport.height + 'px';
										container.style.width = viewport.width + 'px';
										// SVG rendering by PDF.js
										page.getOperatorList()
											.then(function (opList) {
												var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
												return svgGfx.getSVG(opList, viewport);
											})
											.then(function (svg) {
												div.appendChild(svg);
												if (page.pageIndex === pdf.numPages - 1) {
													toCenter();
													scope.lock=false;
												}
											});
									});
									i++;
								}
							}


							scope.printPDF = function printPDF($event) {
								// Если браузер ie или firefox - открываем pdf в новой вкладке
								if(
									navigator.userAgent.indexOf('MSIE') !== -1 ||
									navigator.appVersion.indexOf('Trident/') !== -1 ||
									navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
								){
									return
								}
								// Если это другие браузеры, то останавливаем дефолтное событие дабы новая вкладка не открывалась
								$event.preventDefault();

								var elem = document.getElementById("pdf_print");
								var iframe = document.createElement('iframe');
								iframe.id = 'print-frame';
								iframe.style.overflow = 'scroll';
								iframe.style.height = '0';
								iframe.src = url;
								elem.appendChild(iframe);

								angular.element(iframe).on('load', function() {
									try {
										iframe.contentWindow.print();
									} catch(err) {
										var winref = window.open(url);
									}
								});
							};
							scope.downloadPDF = function downloadPDF() {
								return url;
							};


							scope.zoomIn = function zoomIn() {
								if(!scope.lock){
									scope.lock=true;
									scope.zoomScale = scope.zoomScale + 0.05;
									renderPage(shownPdf, true);
								}
							};

							scope.zoomOut = function zoomOut() {
								if(!scope.lock && scope.zoomScale > 0.05){
									scope.lock=true;
									scope.zoomScale = scope.zoomScale - 0.05;
									renderPage(shownPdf, true);
								}
							};
						}, 40);


					}


					function toCenter() {
						$timeout(function () {
							var scrollTop = window.pageYOffset || document.body.scrollTop;
							var popupHeight = angular.element(document.querySelector('.mos-feedback-reviews-pdf')).height();
							var windowHeight = window.innerHeight;
							var windowWidth = window.innerWidth;
							var pdfToolbar = document.querySelector('.mos-feedback-reviews-pdf_toolbar');
							var toolbarHeight = 60;
							if (pdfToolbar) {
								toolbarHeight = pdfToolbar.clientHeight;
							}
							// angular.element('.mos-feedback-reviews-pdf-wrap').css({height: (windowHeight-toolbarHeight)  + 'px', width: popupWidth+'px'});
							var top = (windowHeight - toolbarHeight - popupHeight) / 2;

							if (windowWidth < 768) {
								var height = '';
								if (popupHeight >= windowHeight - toolbarHeight) {
									height = windowHeight - toolbarHeight
								}
								TweenLite.to('.mos-feedback-reviews-pdf', 0.25, {top: 0 + 'px',	height: height, ease:Power0.easeNone,	onComplete: function(){}});

							} else {
								var height = '';
								if (top < 50) {
									top = 50;

									if (popupHeight >= windowHeight - toolbarHeight - 55) {
										height = windowHeight - toolbarHeight - 55;
									}
								}

								TweenLite.to('.mos-feedback-reviews-pdf', 0.25, {top: top + 'px', height: height, ease:Power0.easeNone,	onComplete: function(){}});
								// angular.element('.mos-feedback-reviews-pdf').css({top: top + 'px'});
							}
							var pdfWrap = document.querySelector('.mos-feedback-reviews-pdf-wrap');
							if (pdfWrap) {
								$(pdfWrap).mCustomScrollbar('destroy');
								$(pdfWrap).mCustomScrollbar({
									axis:"yx",
									scrollInertia: 500,
									mouseWheel: {scrollAmount: 150},
									advanced:{updateOnContentResize: false, autoExpandHorizontalScroll: true}});
							}
						}, 40);

					}

				},
				templateUrl: UrlSrvc.tmplPath('mosFeedbackReviews/mosFeedbackReviews.tpl.html')
			};
		}]);
