angular.module('mosapp.mosError',[
	'ngSanitize'
])
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])
.directive('mosError', ['UrlSrvc', 'apiSrvc', '$stateParams', '$timeout',
function(UrlSrvc, apiSrvc, $stateParams, $timeout) {
	return {
		scope: {
			mosError: '='
		},
		link: function(scope) {
			scope.$watch('mosError', function(newV) {
				if (newV != undefined) {
					apiSrvc.getData('widgets','mosError', {code:scope.mosError}, true).then(function(res) {
						scope.pageInfo = res;

						$timeout(function() { // after render error page
							if (typeof window.phantomJsError === 'function') {
								window.phantomJsError(scope.mosError);
							}
						}
						);

					});
				}
			});
		},
		templateUrl: UrlSrvc.tmplPath('mosError/mosError.tpl.html')
	};
}]);
