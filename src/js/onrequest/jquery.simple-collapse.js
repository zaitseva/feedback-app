+function($) {
	'use strict';

	var Collapse = function(element) {
		var self = this;

		this.$element = $(element);
		this.$toggle = this.$element.find('[data-simple-collapse-toggle]')
			.not(this.$element.find('[data-simple-collapse-target] [data-simple-collapse-toggle]'));

		this.options = { toggle: false };
		var attrOptions = this.$element.data('simple-collapse');
		this.options = $.extend(this.options, attrOptions);

		this.$toggle.on('click', function() {
			self.toggle(this);
		});

		this.$toggle.each(function() {
			var $toggle = $(this);
			self.toggle($toggle, self.options.toggle);
		});
	}


	Collapse.prototype.hide = function($toggle, $target) {
		$toggle.removeClass('sc-show sc-showing').addClass('sc-hiding');
		$target.removeClass('sc-show sc-showing').addClass('sc-hiding');
		this.cacheHeight($target);

		TweenLite.to($target, 0.2, {
			height: 0,
			ease: Power1.easeIn,
			onComplete: function() {
				$toggle.removeClass('sc-hiding').addClass('sc-hide');
				$target.removeClass('sc-hiding').addClass('sc-hide');
			}
		});
	};


	Collapse.prototype.show = function($toggle, $target) {
		var self = this;
		$toggle.removeClass('sc-hide sc-hiding').addClass('sc-showing');
		$target.removeClass('sc-hide sc-hiding').addClass('sc-showing');

		TweenLite.fromTo($target, 0.3, { height: 0 }, {
			height: $target.attr('data-cached-height'),
			ease: Power3.easeOut,
			onComplete: function() {
				$toggle.removeClass('sc-showing').addClass('sc-show');
				$target.removeClass('sc-showing').addClass('sc-show');
				self.cacheHeight($target);
			}
		});
	}


	Collapse.prototype.toggle = function(toggleEl, forceState) {
		var $toggle = $(toggleEl);
		var $target = $toggle.parent().find('[data-simple-collapse-target]').eq(0);

		if (forceState === true) {
			this.show($toggle, $target);
		} else if (forceState === false) {
			this.hide($toggle, $target);
		} else {
			if ($toggle.hasClass('sc-hide') ||
					$toggle.hasClass('sc-hiding')) {
				this.show($toggle, $target);
			} else {
				this.hide($toggle, $target);
			}
		}
	};


	Collapse.prototype.cacheHeight = function($target) {
		$target.css('height', 'auto').attr('data-cached-height', $target.height());
	};


	function Plugin(option) {
		return this.each(function() {
			new Collapse(this);
		});
	};


	$.fn.simpleCollapse = Plugin;
	$.fn.simpleCollapse.Constructor = Collapse;

	// Autoinit
	$(function() {
		$('[data-simple-collapse]').simpleCollapse();
	});
}(jQuery);
