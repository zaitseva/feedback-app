/*
 *
 *
 *
 */
angular.module('mosapp',['pascalprecht.translate'])
.constant(
	'mosconfig', {
		'titleParams': {
			separator: ' / ',
			siteName: {
				ru: 'Сайт Москвы',
				en: 'Moscow City Web Site'
			}
		},


		'domain': 'www.mos.ru', // если без протокола - его добавит js, если со слэшем в конце - его уберет js, если с двумя слэшами в конце - js уберет только последний, если ты дочитал до этих слов - лучше не трогай ничего
		'jsPath':'/front/markup/feedback/static/js/', // путь к папке со скриптами
		'cssPath':'/front/markup/feedback/static/css/', // путь к папке со скриптами
		'imagesPath': '/static/images/', // путь к папке с картинками
		'i18nPath':'/front/markup/feedback/static/i18n/', // путь к папке с файлами поддержки мультиязычности
		'specialType':{
			'types': ['person','event','lifehack']
		},
		'fileFormat': 'txt, doc, docx, rtf, xls, xlsx, pps, ppt, pptx, pdf, jpg, jpeg, bmp, png, tif, gif, pcx, mp3, wma, avi, mp4, mkv, wmv, mov, flv',
		'pagePath':{ // путь к страницам разделов
		},
		'restAPI': { // путь к сервисам
			'feedback':{
				'feedbackMeet':'/front/markup/feedback/static/json/feedback/feedback_meet.json?mosRuVersionControlFlag', //статика Прием граждан
				'feedbackReviews':'/front/markup/feedback/static/json/feedback/feedback_reviews.json?mosRuVersionControlFlag', //Обзоры обращений
				'feedbackMail':'/front/markup/feedback/static/json/feedback/feedback_mail.json?mosRuVersionControlFlag', //статика Прием корреспонденции
				'feedbackPhones':'/front/markup/feedback/static/json/feedback/feedback_phones.json?mosRuVersionControlFlag', //статика Телефоны
			},
			
			'documents':{
				//DEV
				'feedbackReviews':'/front/markup/feedback/static/json/api/documents/v2/frontend/json/[lang]/appeals-statistics.json?mosRuVersionControlFlag'
			},
			'alerts': {
				'alerts': '/api/alerts/v1/frontend/json/[lang]/alerts'
				//DEV 'alerts': '/front/markup/feedback/static/json/api/alerts/v1/frontend/json/[lang]/alerts.json'
			},
			'widgets': {
				'mosError': '/api/widgets/v2/frontend/json/[lang]/errors/%code%'
				//DEV 'mosError': '/front/markup/feedback/static/json/api/widgets/v1/json/error_pages/%code%.json'
			}
		}
	}
);
