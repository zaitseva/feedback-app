var oldIE = false;

// make it safe to use console.log always
// (function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log("");return window.console;}catch(a){return (window.console={});}}());


// contrast logic

function setContrast() {
	var HTMLel = document.getElementsByTagName('html')[0];
	var className = "contrast";

	if (localStorage.getItem("contrast") === "true") {
		if (HTMLel.classList) {HTMLel.classList.add(className);}
		else {HTMLel.className += ' ' + className;}
	} else {
		HTMLel.classList.remove(className);
	}
	// console.log('contrast scheme');
}
function resetContrast() {
	var HTMLel = document.getElementsByTagName('html')[0];
	var className = "contrast";
	if (HTMLel.classList) {HTMLel.classList.remove(className);}
	else {HTMLel.className = HTMLel.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');}
	// console.log('normal scheme');
}
function testContrast(e) {
	// прочитать local storage
	var storage = function supports_html5_storage() {
		try {
			return 'localStorage' in window && window.localStorage !== null;
		} catch (e) {
			return false;
		}
	};
	if (storage) {
		// сменить состояние
		var contrast = localStorage.getItem("contrast");
		var evpBlind = getCookie("EVP_blindVersion");
		if (contrast && contrast==="true" || evpBlind === "Y" ) {
			setContrast();
		} else {
			resetContrast();
		}
	}

}


if ('v'=='\v') { // Note: IE listens on document
    document.attachEvent('onstorage', testContrast, false);
} else if (window.opera || window.webkit){ // Note: Opera and WebKits listens on window
    window.addEventListener('storage', testContrast, false);
} else { // Note: FF listens on document.body or document
    document.body.addEventListener('storage', testContrast, false);
}

testContrast();

function addElEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function(){
      handler.call(el);
    });
  }
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(

    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"

  ));

  return matches ? decodeURIComponent(matches[1]) : undefined;
};
function contrastLinkClick(e){
	// прочитать local storage
	var storage = function supports_html5_storage() {
		try {
			return 'localStorage' in window && window.localStorage !== null;
		} catch (e) {
			return false;
		}
	};
	if (storage) {
		// сменить состояние
		var contrast = localStorage.getItem("contrast");
		var newValue, evpBlind;
		if (contrast && contrast==="true" ||  getCookie("EVP_blindVersion") === "Y" ) {
			newValue = "false";
			evpBlind = "N";
		} else {
			newValue = "true";
			evpBlind = "Y";
		}
		localStorage.setItem("contrast", newValue);
		document.cookie="EVP_blindVersion="+evpBlind+"; path=.mos.ru; domain=.mos.ru; expires=0";
		if (window.opera || window.webkit) {
		// Note: Opera and WebKits don't fire storage event on event source window
		// Do it manually
			onStorage();
		}
		testContrast();


		var event;
		if (window.CustomEvent) {
			event = new CustomEvent('contrastTrigger', {detail: {contrast: newValue}});
		} else {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent('contrastTrigger', true, true, {contrast: newValue});
		}

		window.dispatchEvent(event);
	}
}
var contrastlink = document.getElementById('contrastlink');
if (contrastlink) {
	addElEventListener(contrastlink, 'click', contrastLinkClick);
}



/* device detector*/
function testDevice() {
	var _doc_element, _find, _user_agent;
	window.device={};
	_doc_element=window.document.documentElement;
	_user_agent=window.navigator.userAgent.toLowerCase();
	device.ios=function(){return device.iphone() || device.ipod() || device.ipad();};
	device.iphone=function(){return _find('iphone');};
	device.ipod=function(){return _find('ipod');};
	device.ipad=function(){return _find('ipad');};
	device.android=function(){return _find('android');};
	device.androidPhone=function(){return device.android() && _find('mobile');};
	device.androidTablet=function(){return device.android() && !_find('mobile');};
	device.blackberry=function(){return _find('blackberry') || _find('bb10') || _find('rim');};
	device.blackberryPhone=function(){return device.blackberry() && !_find('tablet');};
	device.blackberryTablet=function(){return device.blackberry() && _find('tablet');};
	device.windows=function(){return _find('windows');};
	device.windowsPhone=function(){return device.windows() && _find('phone');};
	device.windowsTablet=function(){return device.windows() && _find('touch');};
	device.fxos=function(){return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');};
	device.fxosPhone=function(){return device.fxos() && _find('mobile');};
	device.fxosTablet=function(){return device.fxos() && _find('tablet');};
	device.meego=function(){return _find('meego');};
	device.mobile=function(){return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();};
	device.tablet=function(){return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();};
	device.portrait=function(){return Math.abs(window.orientation)!==90;};
	device.landscape=function(){return Math.abs(window.orientation)===90;};
	_find = function(needle){return _user_agent.indexOf(needle) !== -1;};

	var HTM = document.getElementsByTagName('html')[0];
	var className = '';
	if (device.mobile()) { className = 'phone'; }
	else if (device.tablet()) { className = 'nophone'; }
	else {className = 'nophone';}

	if (HTM.classList) {HTM.classList.add(className);}
	else {HTM.className += ' ' + className;}

}
testDevice();

function is_touch_device() {
 return (('ontouchstart' in window) ||
 			(navigator.MaxTouchPoints > 0) ||
 			(navigator.msMaxTouchPoints > 0));
}


var _WINDOW = $(window), _DOCUMENT = $(document), scrollPos = 0;

var scrollDelay = 0;


//_WINDOW.on('contrastTrigger', function(e){});

$(function() {
	var T;


	/*$('a[href=""], a[href="#"]').on('click',function(e){ e.preventDefault(); }).css('cursor','default').removeAttr('href');*/


	oldIE = $('html').hasClass('lt-ie10');


	function setScrollPos(){ scrollPos = _DOCUMENT.scrollTop(); }
	_DOCUMENT.scroll(setScrollPos);




	/* test mode start */
	$('#header').each(function(){
		var hideMess = sessionStorage.getItem("hideMess");
		// var count = Math.ceil(Math.random() * (299 - 219) + 219);
		var count = 0;
		if (!(hideMess && hideMess==="true")) {
			var body = 	$('body');
			if(body.data('redline')){
				var message = $('<div id="testMessage" class="testMessage"><div class="table"><div class="td">Уважаемые эксперты, свои предложения и&nbsp;пожелания присылайте на&nbsp;<a href="mailto:in@mos.ru">in@mos.ru</a><div class="stat" style="display:none;">Наш портал работает в тестовом режиме. Сейчас на&nbsp;сайте <span class="count">'+count+'</span> (из 300 возможных посетителей)</div><div></div></div>');
				$(this).prepend(message);
				body.addClass('isTestMessage');
				var close = $('<a href="" class="closeMess ico icon-close_white"></a>').appendTo(message);

				var url = "/api/widgets/v1/json/users_online";
				$.ajax({
					dataType: "json",
					url: url,
					// data: data,
					success: function(json){
						if (json && json.count) {
							count = json.count;
							message.find('.count').text(count);
							message.find('.stat').css('display','block');
						}
					},
					error: function(){
						// message.find('.stat').css('display','block');
					}
				});


				close.on('click', function(e){
					e.preventDefault();
					message.remove();
					body.removeClass('isTestMessage');
					sessionStorage.setItem("hideMess", "true");
				});

			}
		}
	});
	/* test mode end */





	$('.close-promo').on('click', function(e){
		e.preventDefault();
		$($(this).attr('href')).animate({height: 0, opacity: 0}, 300, function(){
			$(this).remove();
		});
	});


	/* двигающиеся по горизонтали табы*/
	//slidingTabs($('body'));


	/* раскрывашка "ещё..." */
	_DOCUMENT.on('click', '.s-more__opener', function(e){
		e.preventDefault();
		var moreroot = $(this).parents('.s-more:eq(0)');
		if (moreroot.length>0){
			if (moreroot.hasClass('openly')) {
				moreroot.removeClass('openly');
			} else {
				moreroot.addClass('openly');
			}
		}
	});


	/*$('input.custom, select.custom').styler();*/


	/* каруселька новосте и т.п.*/
	$('.s-carousel').each(function(){
		var cont = $(this);
		var contslick = cont.find('.s-carousel__items');
		var cnt = contslick.children().length;
		var prev = cont.find('.s-prev');
		var next = cont.find('.s-next');
		contslick.on('init', function(evt, slick){
			prev.on('click', function(e){
				e.preventDefault();
				if (prev.hasClass('disabled')) {return false;}
				slick.slickPrev();
			});
			if (!slick.slickGetOption('infinite')) {prev.addClass('disabled');}
			next.on('click', function(e){
				e.preventDefault();
				if (next.hasClass('disabled')) {return false;}
				slick.slickNext();
			});
			_WINDOW.on('load resize', function() {
				cont.find('.slick-track').heightAdjustment();
			});
			cont.find('.slick-track').heightAdjustment();
		}).on('afterChange', function(evt, slick, currentSlide, nextSlide) {
			if (slick.slickGetOption('infinite')) {return false;}

			if (currentSlide === 0) {
				prev.addClass('disabled');
			} else {
				prev.removeClass('disabled');
			}
			if (cnt === currentSlide+slick.slickGetOption('slidesToScroll')) {
				next.addClass('disabled');
			} else {
				next.removeClass('disabled');
			}
		}).slick({
			accessibility:false,
			arrows:false,
			draggable: false,
			infinite: cont.data('infinite')? cont.data('infinite') : false,
			swipe: false,
			touchMove: false,
			cssEase: 'ease-in-out',
			easing: 'easeInOutCubic',
			speed: 1200,
			slidesToShow: (cont.data('slidesToShow'))? cont.data('slidesToShow') : 4,
			slidesToScroll: (cont.data('slidesToScroll'))? cont.data('slidesToScroll') : 2,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: (cont.data('slidesToShow'))? cont.data('slidesToShow') - 1 : 3,
						slidesToScroll: (cont.data('slidesToScroll'))? cont.data('slidesToScroll') - 1 : 2,
					}
				}
			]
		});

	});





	$('.b-newsmain-important').each(function(){
		var cont = $(this);
		cont.on('init', function(evt, slick){
			cont.find('.b-newsmain-important__item-image').each(function(){
				var bgimgcont = $(this);
				var bgimg = bgimgcont.find('img');
				bgimg.css('display', 'none');
				bgimgcont.css('background-image','url("'+bgimg.attr('src')+'")');
			});
			var prev = $('<a href="#" class="slick-arrow-prev s-prev"><span class="ico"><span class="icon-butt_arrow_prev_white"></span></span></a>').appendTo(cont);
			var next = $('<a href="#" class="slick-arrow-next s-next"><span class="ico"><span class="icon-butt_arrow_next_white"></span></span></a>').appendTo(cont);
			prev.on('click', function(e){
				e.preventDefault();
				slick.slickPrev();
			});
			next.on('click', function(e){
				e.preventDefault();
				slick.slickNext();
			});
		}).slick({
			accessibility:false,
			arrows:false,
			draggable: false,
			infinite: true,
			swipe: false,
			touchMove: false,
			speed: 500,
			dots: true
		});
	});




	/* автокомплит форм (перенесла в директиву)*/
	/*$('.s-autocompl-form').each(function(){
		var form = $(this), inp = form.find('.s-autocompl-input');
		var bouncetimer;

		var prefetchUrl = inp.data('prfurl');
		var remoteUrl = inp.data('remurl');
		if (!remoteUrl) { console.log('Отсутствует атрибут data-remurl у поля ввода запроса!'); return false; }

		var ttautocomplete = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			prefetch: prefetchUrl,
			remote: remoteUrl
		});

		ttautocomplete.initialize();
		inp.typeahead({
				minLength: 3,
				highlight: true,
			}, {
				name: 'search-autocomplete',
				displayKey: 'value',
				source: ttautocomplete.ttAdapter(),
				templates: {
					header: '<span class="tt-head"><div class="tt-head"><p>Часто ищут:</p></div></span>'
				}
		});
		inp.on('typeahead:opened', function () {
			form.addClass('open');
		});
		inp.on('typeahead:closed', function () {
			form.removeClass('open');
		});

		form.find('input.tt-input').each(function() {
			var inp = $(this);
			inp.on('keypress', function (e) {
				if (e.which === 13) {
					(form.get(0)).submit();
					return true;
				}
			});
			inp.on('click', function (e) {
				$(this).select();
			});
		});

		form.find('input[type="button"]').on('click', function(){
			(form.get(0)).submit();
		});

		inp.on('change', function (e) {
			if ($(this).val()) {
				form.addClass('inpvalue');
			} else {
				form.removeClass('inpvalue');
			}
		});

	});*/






	$('.b-preamble__image, .b-life-promo_image').each(function(){
		var bgimgcont = $(this);
		var bgimg = bgimgcont.find('img');
		bgimg.css('display', 'none');
		bgimgcont.css('background-image','url("'+bgimg.attr('src')+'")');
	});

	$('.b-life-similar').each(function() {
		var cont = $(this).find('.b-life-similar__list');
		cont.on('init', function(evt, slick){
			cont.find('.b-life-similar__item-image').each(function(){
				var bgimgcont = $(this);
				var bgimg = bgimgcont.find('img');
				bgimg.css('display', 'none');
				bgimgcont.css('background-image','url("'+bgimg.attr('src')+'")');
			});
			var prev = $('<a href="#" class="slick-arrow-prev s-prev"><span class="ico"><span class="icon-arrow_left_02_black"></span></span></a>').appendTo(cont);
			var next = $('<a href="#" class="slick-arrow-next s-next"><span class="ico"><span class="icon-arrow_right_03_black"></span></span></a>').appendTo(cont);
			prev.on('click', function(e){
				e.preventDefault();
				slick.slickPrev();
			});
			next.on('click', function(e){
				e.preventDefault();
				slick.slickNext();
			});
		}).slick({
			accessibility:false,
			arrows:false,
			draggable: false,
			infinite: true,
			swipe: false,
			touchMove: false,
			speed: 1000,
			dots: true,
			centerMode: false,
			variableWidth: false,
			slidesToShow: (cont.data('slidesToShow'))? cont.data('slidesToShow') : 4,
			slidesToScroll: (cont.data('slidesToScroll'))? cont.data('slidesToScroll') : 3,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: (cont.data('slidesToShow'))? cont.data('slidesToShow') - 1 : 3,
						slidesToScroll: (cont.data('slidesToScroll'))? cont.data('slidesToScroll') - 1 : 3,
					}
				}
			]
		});
	});




	function slidingTabs(par) {
		par.find('.sliding_tabs').each(function(){
			var cont = $(this);
			var paneCont = cont.find('.tab-content');
			paneCont.on('init', function(evt, slick){
				cont.find('a[data-toggle="tab"]').on('shown.bs.tab', function(e){

					var targ = $(e.target);
					var targPane = $(targ.attr('href'));
					cont.find('.openly').removeClass('openly');
					cont.find('.s-tab.active').removeClass('active');
					targ.parents('.s-tab:eq(0)').addClass('active');
					slick.slickGoTo(targPane.index());
				});
			}).slick({
				accessibility:false,
				arrows:false,
				draggable: false,
				infinite: false,
				swipe: false,
				touchMove: false,
				cssEase: 'ease-out',
				easing: 'easeOutQuad',
				speed: 1300
			});
		});
	}



	$('.bs-modal-lg').on('show.bs.modal', function(e) {
		var cont = $(this);
		cont.find('.b-life-popup-step').slideUp(0);
		cont.find('.current_step').slideDown(0);
		cont.find('.b-next-step a, .b-prev-step a').off('click').on('click', function(e){
			e.preventDefault();
			var href = $(this).attr('href');
			cont.find('.current_step').slideUp(600, 'easeOutCubic', function(){
				$(this).removeClass('current_step');
			});
			$(href).slideDown(600, 'easeOutCubic', function(){
				$(this).addClass('current_step');
			});

		});
	});
	$('.bs-modal-lg').on('hidden.bs.modal', function(e) {
		var cont = $(this);
		cont.find('.b-life-popup-step').slideUp(0);
		cont.find('.current_step').removeClass('current_step');
		cont.find('.b-life-popup-step:eq(0)').addClass('current_step').slideDown();
	});


	$('.customScrollbar').mCustomScrollbar({live:true,scrollInertia:0});




	$('.b-prog-carousel').each(function(){
		var cont = $(this), items = cont.find('.b-prog-carousel__item');
			cont.on('init', function(evt, slick){
				/* cont.find('a[data-toggle="tab"]').on('shown.bs.tab', function(e){

				 	var targ = $(e.target);
					var targPane = $(targ.attr('href'));
				 	cont.find('.openly').removeClass('openly');
					cont.find('.s-tab.active').removeClass('active');
				 	targ.parents('.s-tab:eq(0)').addClass('active');
				 	slick.slickGoTo(targPane.index());
				 });*/

				items.on('click', function(){
					slick.next();
				});
			}).slick({
				accessibility:false,
				arrows:false,
				draggable: false,
				infinite: true,
				swipe: false,
				touchMove: false,
				cssEase: 'ease-out',
				easing: 'easeOutQuad',
				speed: 1000,
				dots: true,
				autoplay: true,
				autoplaySpeed: 15000
			});
	});







/*
	Минимальная высота контентной части
*/
	// $('.b-content__min-height').each(function(){
	// 	var cont = $(this);
	// 	var header = $('#header');
	// 	var footer = $('#footer');
	// 	function setMinContentHeight(){
	// 		cont.css('min-height', (_WINDOW.height()-header.height()-footer.height()+1));
	// 	}
	// 	_WINDOW.on('load resize', setMinContentHeight);
	// });


	$('.b-second-navbar-wrapper').each(function(){
			var cont = $(this);
			function setMarginContent(){
				cont.next().css('margin-top', cont.outerHeight());
			}
			_WINDOW.on('load resize', setMarginContent);
		});

}); /*  document ready*/

(function($) { /*create closure*/
$.fn.heightAdjustment = function(options){
 this.each(function(){
  var H = 0, el = $(this).children();
  el.height('').removeClass('evenlyready');
  el.each(function(){
   H = Math.max(H, $(this).height());
  });
  el.height(H).addClass('evenlyready');
 });
};
/*end of closure*/
})(jQuery);
