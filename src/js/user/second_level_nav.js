/*
$(function() {
	$('.b-onpage-navbar-wrapper, .b-second-navbar-wrapper').each(function(){
		var cont = $(this), doc = $(document);
		var H = cont.height(); // высота неаттаченного меню
		var fixednav = cont.hasClass('b-second-navbar-wrapper');
		var Hatt = (fixednav) ? 50 : 27;
		var header = $('#header');


		var T = false;
		_WINDOW.on('resize', function(){
			if (T) {window.clearTimeout(T);}
			T = window.setTimeout(function(){
				if (!fixednav && !cont.hasClass('attached')) {
					H = cont.height(); // высота неаттаченного меню 
				}
			}, 50);
		});

		var checkflag = false, navpanel = cont.get(0);
		var triggerpos = false;

		var tween = false, posY, speed, targ, scrollSpyOff = false;

		cont.find('a').each(function(){
			var link = $(this);
			link.on('click', function(e){
				if (link.attr('href') && link.attr('href')[0] === '#' && !link.hasClass('applink')) {
					e.preventDefault();
					targ = document.getElementById((link.attr('href')).replace('#',''));
					scrollSpyOff = true;
					if (!link.parent().hasClass('active')) {
						cont.find('.active').removeClass('active');
						link.parent().addClass('active');
					}


					posY = targ.getBoundingClientRect().top + scrollPos;
					if (!fixednav && !cont.hasClass('attached')) {
						H = cont.height(); // высота неаттаченного меню 
					}
					var att = (cont.hasClass('attached')) ? Hatt : 0;
					posY = posY - header.height() - att;
					speed = posY * 0.5;
					speed = (speed < 400) ? 400 : speed;
					speed = (speed > 1800) ? 1800 : speed;
					tween = TweenLite.to(window, speed/1000, {scrollTo:{y:posY}, ease:Power1.easeOut, 
						onComplete: function(){
							tween = false;
							scrollSpyOff = false;
						}});
				}
			});
			if (fixednav) {
				link.width(link.width()).css({'padding-left':0,'padding-right':0});
			}
		});


		function scrollNavObserve() {
			var hH = header.height();
			if (!triggerpos && navpanel.getBoundingClientRect().top < hH) {
				if (!checkflag) {
					checkflag = true;
					// triggerpos = scrollPos;
					triggerpos = 1;
					cont.addClass('attached').css('top',hH).trigger('attached');
					if (tween !== false) {
						tween.kill();
						posY = targ.getBoundingClientRect().top + scrollPos - Hatt - header.height();
						speed = posY * 0.5;
						speed = (speed < 400) ? 400 : speed;
						speed = (speed > 1800) ? 1800 : speed;
						tween = TweenLite.to(window, speed/1000, {scrollTo:{y:posY}, ease:Power1.easeOut, 
							onComplete: function(){
								tween = false;
								scrollSpyOff = false;
							}});
					}
				}
			} else {
				if (triggerpos && scrollPos <= triggerpos && checkflag !== 0) {
					checkflag = 0; 
					cont.removeClass('attached').trigger('untached').css('top','');
					if (tween !== false) {
						posY = posY + Hatt - 0.5;
						speed = posY * 0.5;
						speed = (speed < 400) ? 400 : speed;
						speed = (speed > 1800) ? 1800 : speed;
						tween = TweenLite.to(window, speed/1000, {scrollTo:{y:posY}, ease:Power1.easeOut, 
							onComplete: function(){
								tween = false;
								scrollSpyOff = false;
							}});
					}
					triggerpos = false;
					// очистить таймеры
					window.clearTimeout(T);
					T = window.setTimeout(function(){
						checkflag = false;
					},1000);
				}
			}
		}
		if (!fixednav) {_DOCUMENT.scroll(scrollNavObserve);}
		//scrollNavObserve();



		function scrollSpy(){
			if (!scrollSpyOff) {
				var spyBorder = cont.get(0).getBoundingClientRect().top + cont.height();
				cont.find('a').each(function(){
					var link = $(this);
					if (link.attr('href')) {
						var targ = document.getElementById((link.attr('href')).replace('#',''));
						if (targ && targ.getBoundingClientRect().top <= spyBorder) {
							if (!link.parent().hasClass('active')) {
								cont.find('.active').removeClass('active');
								link.parent().addClass('active');
							}
						}
					}
				});
			}
		}

		var spt;
		_DOCUMENT.on('scroll', function(){ window.clearTimeout(spt); spt = window.setTimeout(scrollSpy, 50); });

	});
}); //  document ready
*/