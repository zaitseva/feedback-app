angular.module('mosapp')
.config([
	'mosconfig', '$translateProvider', '$translatePartialLoaderProvider', 'LangSrvcProvider',
	function(
		mosconfig, $translateProvider, $translatePartialLoaderProvider, LangSrvcProvider
	) {
		// translate
		$translateProvider.usePostCompiling(true);
		$translateProvider.useSanitizeValueStrategy('escape');// sanitize - неправильно отрабатывает translate при использовании в виде фильтра
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: mosconfig.i18nPath+'{part}/{lang}.json?mosRuVersionControlFlag'
		});
		$translateProvider.preferredLanguage(LangSrvcProvider.setCurrentLang());
	}
]);