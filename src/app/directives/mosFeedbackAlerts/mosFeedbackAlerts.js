angular.module('mos.feedback.alerts', [])
.directive('mosFeedbackAlerts', ['UrlSrvc', 'apiSrvc',
						function(UrlSrvc, apiSrvc) {
	return {
		restrict: 'AE',
		scope: {
			sectionCode: '@'
		},
		link: function link(scope, element, attrs, controller) {
			scope.hideme = true;

			var params = {
				fields: 'section_code,message,type',
				expand: 'section_code',
				filter: {
					'section_code': scope.sectionCode
				}
			};
			apiSrvc.getData('alerts', 'alerts', params, true).then(function(res) {
				if (angular.isArray(res.items) && res.items.length) {
					for (var i = 0, len = res.items.length; i < len; i++) {
						var alrt = res.items[i];

						if (alrt.section_code === scope.sectionCode) {
							scope.notice = alrt;
							scope.hideme = false;
							break;
						}
					}
				}
			}, function() {

			});
		},
		templateUrl: UrlSrvc.tmplPath('mosFeedbackAlerts/mosFeedbackAlerts.tpl.html')
	};
}]);
