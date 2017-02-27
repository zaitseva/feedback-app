// Make sure to include the `ui.router` module as a dependency
angular.module('feedback', [
	'ui.router',
	'ngAnimate',
	'mgcrea.ngStrap',
	'ngFileUpload',

	'mosapp',
	'feedback.templates',

	'mos.feedback.main',
	'mos.feedback.mail',
	'mos.feedback.meet',
	'mos.feedback.phones',
	'mos.feedback.reviews',

	'mosapp.mosError'
])
.service('metaConfig', ['$q', function($q) {
	var config = {
		feedback: {
			section: 'Обратная связь',
			title: 'Обратная связь / На связи с городом',
			description: 'Не нашли ответ на свой вопрос? Задайте его любым удобным способом: через электронную приёмную или по почте, по телефону или лично.',
			image: 'img',
			url: ''
		},
		mail: {
			section: 'Приём корреспонденции',
			title: 'Письмо в Правительство Москвы / Приём писем от горожан / Приём писем',
			description: 'Письмо в Правительство Москвы можно отправить по почте или привезти лично.',
			image: 'img',
			url: ''
		},
		meet: {
			section: 'Приём граждан',
			title: 'Приём граждан / Приёмная Правительства Москвы',
			description: 'Хотите задать вопрос лично? Обратитесь в приёмную Правительства Москвы в будний день или во вторую субботу месяца.',
			image: 'img',
			url: ''
		},
		phones: {
			section: 'Телефоны',
			title: 'Телефоны обратной связи / Телефоны / Телефоны для вопросов',
			description: 'Получить ответ на вопрос можно по телефону. Звоните в единую справочную, Центр мониторинга общественного мнения, специалистам портала госуслуг или по телефону прямой связи Правительства Москвы с горожанами.',
			image: 'img',
			url: ''
		},
		reviews: {
			section: 'Обзоры обращений пользователей',
			title: 'Обзоры обращений пользователей / Решения по обращениям пользователей',
			description: 'Мы реагируем на все обращения, приходящие от пользователей. На этой странице вы можете узнать о том, как мы отвечаем на вопросы, решаем проблемы и помогаем посетителям работать с порталом максимально эффективно',
			image: 'img',
			url: ''
		},
	};
	this.config = config;
	this.init = function() {
		return $q.when(config);
	};
	return this;
}])
	.run(
	['$rootScope', '$state', '$location', '$window',
		function ($rootScope, $state, $location, $window) {
			$rootScope.$on('$stateChangeStart', function(evnt, toState, toParams, fromState, fromParams, options) {
				if (toState.forceReloadPage && fromState.name) { // https://redmine.notamedia.ru/issues/81536
					evnt.preventDefault();
					$window.location.href = $state.href(toState.name);
				}

			});
		}
	]
)
	.config([
		'$stateProvider',
		'$urlRouterProvider',
		'$urlMatcherFactoryProvider',
		'$locationProvider',
		'$compileProvider',
		'$translatePartialLoaderProvider',
		'$translateProvider',
		function ($stateProvider,
				  $urlRouterProvider,
				  $urlMatcherFactoryProvider,
				  $locationProvider,
					$compileProvider,
					$translatePartialLoaderProvider,
					$translateProvider) {


			$urlMatcherFactoryProvider.strictMode(false);
			$locationProvider.html5Mode(true);
			$locationProvider.hashPrefix('!');
			$compileProvider.debugInfoEnabled(false);

			$translatePartialLoaderProvider.addPart('feedback');

			$urlMatcherFactoryProvider.type('keyVal', {}, function () {
				return {
					encode: function (str) {
						return str;
					},
					decode: function (value, key) {
						return value;
					},
					is: angular.isString,
					equals: function (a, b) {
						return a == b;
					}
				};
			});

			this.scrollTop = function scrollTop(speed) {
				TweenLite.to(window, (speed || 0.75), {
					scrollTo: {y: 0}, ease: Power2.easeOut,
					onComplete: function () {
					}
				});
			};
			$urlRouterProvider
				.when('', '/reviews')
				.otherwise('/reviews');


			$stateProvider
				.state('feedback', {
					abstract: true,
					url: '/',
					template: '<div data-mos-feedback-main=""></div>'
				})
				.state('feedback.phones', {
						url: 'phones',
						template: '<div data-mos-feedback-phones=""></div>',
							onEnter: function () {
						scrollTop(0.4);
					}
					})
					.state('feedback.mail', {
						url: 'mail',
						template: '<div data-mos-feedback-mail=""></div>',
							onEnter: function () {
						scrollTop(0.4);
					}
					})
					.state('feedback.meet', {
						url: 'meet',
						template: '<div data-mos-feedback-meet=""></div>',
						onEnter: function () {
						scrollTop(0.4);
					}
					})
					.state('feedback.reviews', {
						url: 'reviews',
						template: '<div data-mos-feedback-reviews=""></div>',
						onEnter: function () {
						scrollTop(0.4);
					}
					})
				.state('404', {
					url: '/404',
					template: '<div data-mos-error="404"></div>'
				});

		}
	]);
