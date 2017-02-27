angular.module('mos.feedback.meet', ['ngSanitize'])
.directive('mosFeedbackMeet', ['UrlSrvc','apiSrvc','toolsSrvc', 'metaConfig', 'mosconfig', 
	function(UrlSrvc, apiSrvc, toolsSrvc, metaConfig, mosconfig) {
	return {
		restrict: 'AE',
		scope: {
		},
		link: function link(scope, element, attrs, controller) {
			

				toolsSrvc.setMeta(scope, metaConfig.config, 'meet');
			toolsSrvc.setTitle(metaConfig.config.meet.section);

			 apiSrvc.getData('feedback', 'feedbackMeet', {}, true, element).then(
					function(res){
						if (angular.isObject(res)) {
							scope.meet = res;
						} else {
							scope.error = err;
						}
					},
					function(err){
						scope.error = err;
					}
				);
			
		},
		templateUrl: UrlSrvc.tmplPath('mosFeedbackMeet/mosFeedbackMeet.tpl.html')
	};
}]);
