'use strict';

var appFiles = {
	'appModules': {
		'feedback': [
			'_feedback',
			'mosFeedbackMain',
			'mosFeedbackMail',
			'mosFeedbackMeet',
			'mosFeedbackPhones',
			'mosFeedbackReviews',
			'mosFeedbackAlerts',
			'mosError'
		]
	}
};
if (exports) {
	exports.files = appFiles;
	exports.mergeFilesFor = function() {
		var files = [];

		Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
			appFiles[filegroup].forEach(function(file) {
				// replace @ref
				var match = file.match(/^\@(.*)/);
				if (match) {
					files = files.concat(appFiles[match[1]]);
				} else {
					files.push(file);
				}
			});
		});

		return files;
	};
}
