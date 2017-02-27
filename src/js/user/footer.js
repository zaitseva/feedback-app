$(function () {
	/* каруселька в подвале*/
	//$('.b-sites_list').each(function () {
	//	var contrast = $('html').hasClass('contrast');
	//	var cont = $(this);
	//	var slidesToShow = (cont.data('slidesToShow')) ? cont.data('slidesToShow') : ((contrast) ? 4 : 6);
	//	var slidesToScroll = (cont.data('slidesToScroll')) ? cont.data('slidesToScroll') : ((contrast) ? 4 : 6);
	//	cont.on('init', function (evt, slick) {
	//		var prev = $('<a href="#" class="slick-arrow-prev s-prev"><span class="ico"><span class="ico"></span></span></a>').appendTo(cont);
	//		var next = $('<a href="#" class="slick-arrow-next s-next"><span class="ico"><span class="ico"></span></span></a>').appendTo(cont);
    //
	//		prev.on('click', function (e) {
	//			e.preventDefault();
	//			slick.slickPrev();
	//		});
	//		next.on('click', function (e) {
	//			e.preventDefault();
	//			slick.slickNext();
	//		});
	//	}).slick({
	//		accessibility: false,
	//		arrows: false,
	//		draggable: false,
	//		infinite: true,
	//		swipe: false,
	//		touchMove: false,
	//		cssEase: 'ease-in-out',
	//		easing: 'easeInOutCubic',
	//		speed: 1600,
	//		dots: true,
	//		slidesToShow: slidesToShow,
	//		slidesToScroll: slidesToScroll,
	//		responsive: [
	//			{
	//				breakpoint: 1200,
	//				settings: {
	//					slidesToShow: slidesToShow - 2,
	//					slidesToScroll: slidesToScroll - 2
	//				}
	//			}
	//		]
	//	});
	//});
    //
    //
	//$('.sliding_tabs').each(function () {
	//	var cont = $(this);
	//	var paneCont = cont.find('.tab-content');
	//	paneCont.on('init', function (evt, slick) {
	//		cont.find('.tab-content').addClass('hide_footertab');
	//		cont.find('.b-footer-others__tabs').addClass('closed_pane');
	//		cont.find('a[data-toggle="tab"]').on('click', function (e) {
	//			var targ = $(e.target);
	//			var targPane = $(targ.attr('href'));
	//			cont.find('.openly').removeClass('openly');
	//			if ($(this).parent().hasClass('active')) {
	//				cont.find('.tab-content').addClass('hide_footertab');
	//				cont.find('.b-footer-others__tabs').addClass('closed_pane');
	//				cont.find('.s-tab.active').removeClass('active');
	//			} else {
	//				cont.find('.tab-content').removeClass('hide_footertab');
	//				cont.find('.b-footer-others__tabs').removeClass('closed_pane');
	//				cont.find('.s-tab.active').removeClass('active');
	//				targ.parents('.s-tab:eq(0)').addClass('active');
	//			}
	//			slick.slickGoTo(targPane.index());
	//			return false;
	//		});
	//	}).slick({
	//		accessibility: false,
	//		arrows: false,
	//		draggable: false,
	//		infinite: false,
	//		swipe: false,
	//		touchMove: false,
	//		cssEase: 'ease-out',
	//		easing: 'easeOutQuad',
	//		speed: 1000
	//	});
	//});

});
