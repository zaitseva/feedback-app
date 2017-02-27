angular.module('mos.feedback.mail', ['ngSanitize'])
.directive('mosFeedbackMail', ['UrlSrvc','apiSrvc','toolsSrvc', 'metaConfig', 'mosconfig', 
	function(UrlSrvc, apiSrvc, toolsSrvc, metaConfig, mosconfig) {
	return {
		restrict: 'AE',
		scope: {
		},
		link: function link(scope, element, attrs, controller) {
			

			toolsSrvc.setMeta(scope, metaConfig.config, 'mail');
			toolsSrvc.setTitle(metaConfig.config.mail.section);


			 apiSrvc.getData('feedback', 'feedbackMail', {}, true, element).then(
					function(res){
						if (angular.isObject(res)) {
							scope.mail = res;
						} else {
							scope.error = err;
						}
					},
					function(err){
						scope.error = err;
					}
				);
		},
		templateUrl: UrlSrvc.tmplPath('mosFeedbackMail/mosFeedbackMail.tpl.html')
	};
}]);
