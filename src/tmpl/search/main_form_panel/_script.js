$(function() {
	// панель поиска под хидером
	$('.b-search-panel__form').each(function(){
		var form = $(this);
		form.on('submit', function(){
			return true;
		});
	});
}).on('click','#search-panel-opener', function(e){
	e.preventDefault();
	var searchPanel = $('#search-panel');
	if (searchPanel.data('onAction')==='slide') {return false;}
	searchPanel.data('onAction','slide');
	var lnk = $(this);
	if (!searchPanel.hasClass('expanded')) {
		if (!searchPanel.data('height')) { // если еще не была открыто
			// узнать ее натуральную высоту
			searchPanel.css('opacity',0).addClass('preexpanded');
			// см. css: .preexpanded === .expanded, но не трогает другие элементы
			searchPanel.data('height', searchPanel.height());
			searchPanel.removeClass('preexpanded').css('opacity','');
		}
		lnk.addClass('expanded');
		TweenLite.to(searchPanel, 0.8, {
			opacity: 1, 
			height: searchPanel.data('height'), 
			ease:Power3.easeOut, 
			onComplete: function(){
				searchPanel.css({opacity: '',height: '',overflow: ''}).addClass('expanded');
				searchPanel.find('.tt-input').trigger('focus');
				searchPanel.data('onAction','off');
			}
		});
	} else {
		if (!searchPanel.data('height')) { // если еще не была открыто
			searchPanel.data('height', searchPanel.height());
		}
		lnk.removeClass('expanded');
		TweenLite.to(searchPanel, 0.8, {
			opacity: 0, 
			height: 0, 
			ease:Power1.easeOut, 
			onComplete: function(){
				searchPanel.css({opacity: '',height: '',overflow: ''}).removeClass('expanded');
				searchPanel.data('onAction','off');
			}
		});

	}

	// if (searchPanel.hasClass('expanded')) {
	// 	searchPanel.removeClass('expanded');
	// 	lnk.removeClass('expanded');
	// } else {
	// 	searchPanel.addClass('expanded');
	// 	lnk.addClass('expanded');
	// 	searchPanel.find('.tt-input').trigger('focus');
	// }


});