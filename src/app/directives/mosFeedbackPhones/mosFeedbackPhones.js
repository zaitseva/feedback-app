angular.module('mos.feedback.phones', ['ngSanitize'])
.directive('mosFeedbackPhones', ['UrlSrvc','apiSrvc','toolsSrvc', 'metaConfig', 'mosconfig', 
	function(UrlSrvc, apiSrvc, toolsSrvc, metaConfig, mosconfig) {
	return {
		restrict: 'AE',
		scope: {
		},
		link: function link(scope, element, attrs, controller) {
		

			toolsSrvc.setMeta(scope, metaConfig.config, 'phones');
			toolsSrvc.setTitle(metaConfig.config.phones.section);


			 apiSrvc.getData('feedback', 'feedbackPhones', {}, true, element).then(
					function(res){
						if (angular.isArray(res.items) && res.items.length) {
							scope.phones = res;
						} else {
							scope.error = err;
						}
					},
					function(err){
						scope.error = err;
					});
			scope.start = true;

			scope.init = function($event) {
				scope.start = false;
				var $this = element.find($event.currentTarget);
				var $dropdown = $this.parent();
				var $content = $dropdown.find('.js-phone-content');
				var openClass = 'mos-feedback-phones__dropdown_state_open';
				var contentHiddenClass = 'mos-feedback-phones__dropdown__content_state_hidden';

				$dropdown.toggleClass(openClass);
				$content.toggleClass(contentHiddenClass);
			};
		},
		templateUrl: UrlSrvc.tmplPath('mosFeedbackPhones/mosFeedbackPhones.tpl.html')
	};
}]);
