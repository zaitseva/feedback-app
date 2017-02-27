angular.module('mos.feedback.main', [])
.directive('mosFeedbackMain', ['UrlSrvc', '$timeout', 'toolsSrvc', 'metaConfig', '$rootScope', '$state',
	function(UrlSrvc, $timeout, toolsSrvc, metaConfig, $rootScope, $state) {
	return {
		restrict: 'AE',
		scope: {
		},
		link: function link(scope, element, attrs, controller) {
			var menuTimeout;
			var menu = element.find('.mos-feedback-main__menu-wrapper');
			var oldBreakpoint;
			var _window = $(window);
			var windowWidthWatcher;
			var oldWindowWidth;

			element.on('$destroy', function() {
				if (typeof windowWidthWatcher === 'function') {
					windowWidthWatcher();
				};

				angular.element(window).off('resize', onWindowResize);
			});

			scope.currentState = $state.current.name;
			$rootScope.$on('$stateChangeSuccess', function() {
				scope.currentState = $state.current.name;
			});

			var winW = _window.width();
			oldBreakpoint = winW < 991 ? 'tablet' : 'laptop';
			setDisplayMode(oldBreakpoint);

			$timeout(function() {
				menu.mCustomScrollbar({
					axis: 'x',
					callbacks: {
						onInit: function() {
							if (oldBreakpoint === 'tablet') {
								menu.mCustomScrollbar('scrollTo', '.mos-feedback-main__menu-item_active');
							}
						}
					}
				});

				$timeout(function() {
					changeMenuOrientation(oldBreakpoint, winW);
				}, 0);

				angular.element(window).on('resize', onWindowResize);
			}, 0);

			function onWindowResize(e) {
				var W = window.innerWidth;
				if (oldWindowWidth !== W) {
					$timeout.cancel(menuTimeout);
					menuTimeout = $timeout(checkWindowWidth, 80);
					if (scope.displayMode === 'wide') {
						menu.width(_window.width());
					}
				}
				oldWindowWidth = W;
			}

			function checkWindowWidth() {
				var windowWidth = _window.width();
				var newBreakpoint = windowWidth < 991 ? 'tablet' : 'laptop';
				// if (newBreakpoint !== oldBreakpoint) {
				// 	oldBreakpoint = newBreakpoint;
					changeMenuOrientation(newBreakpoint, windowWidth);
				// }
			}

			function changeMenuOrientation(breakpoint, windowWidth) {
				setDisplayMode(breakpoint);
				if (breakpoint === 'tablet') {
					menu.mCustomScrollbar({axis: 'x'});
					menu.width(windowWidth);
					if (!windowWidthWatcher) {
						windowWidthWatcher = scope.$watch(function() {
							return _window.width();
						}, function(newV) {
							if (scope.displayMode === 'wide') {
								menu.width(newV);
							}
						});
					}
				} else {
					if (typeof windowWidthWatcher === 'function') {
						windowWidthWatcher();
						windowWidthWatcher = null;
					}

					menu.css({width: ''});
					menu.mCustomScrollbar('destroy');
				}
			}

			function setDisplayMode(breakpoint) {
				if (breakpoint === 'tablet') {
					scope.displayMode = 'wide';
					menu.addClass('mos-feedback-main__menu-wrapper_wide');
				} else {
					menu.removeClass('mos-feedback-main__menu-wrapper_wide');
					scope.displayMode = 'narrow';
				}
			}

		},
		templateUrl: UrlSrvc.tmplPath('mosFeedbackMain/mosFeedbackMain.tpl.html')
	};
}]);
