/*!
 * RG Lightbox 0.0.1
 * http://rgkevin.it
 * MIT licensed
 *
 * Copyright (C) 2013 @RGkevin
 */

(function(root, factory) {

	/* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(['spin'], factory)

  /* Browser global */
  else root.RGlightbox = factory( root.Spinner )

})
(this, function(Spinner) {
	'use strict';

	/**
   * Fills in default values.
   */
  function merge(obj) {
  	for (var i = 1, len = arguments.length; i < len; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  // Built-in defaults

  var defaults = {
  	transition: 350,				// transition duration
  	spin : {
  		top: 50,
  		left: 50
  	}								// default for spin
  }

  /* Constructor */
  function RGlightbox(options) {
  	if (typeof this == 'undefined') return new RGlightbox(options)
  	// extends defaults
    this.opts = merge(options || {}, RGlightbox.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  /**
   * Build Prototype
   */

  merge(RGlightbox.prototype, {

  	show : function() {
  		var _that = this;
  		console.log('se ha llamado show');
  		// show backdrop
  		this.showDB(function(){
				// show lightbox container when BD loads
				_that.showLB();
				_that.loading();
			});
  	},

	  /**
	   * Utilities
	   */

	  // build lightbox
	  buildLB : function() {
	  	var newRGlightbox = window.document.getElementById('rglightbox');

			if (!newRGlightbox) {

				newRGlightbox = document.createElement('div');

				var newController = document.createElement('div'),
				newInfo           = document.createElement('div');

				// rglightbox
				newRGlightbox.className = 'rglightbox rg-fade';
				newRGlightbox.id        = 'rglightbox';

			}

			return newRGlightbox;
	  },
	  // show lightbox
	  showLB : function() {
	  	var newRGlightbox = this.buildLB();
			// container
			var newContainer       = document.getElementById('rglightbox-container') || document.createElement('div');
			newContainer.id        = 'rglightbox-container';
			newContainer.className = 'rglightbox-container';
			newContainer.appendChild(newRGlightbox);
	  	// add lightbox container structure to document
			document.getElementsByTagName("body")[ 0 ].appendChild(newContainer);
			// show lightbox
			window.setTimeout(function() {
				newRGlightbox.className = newRGlightbox.className + ' rg-fadein';
			}, 10);
	  },

	  // build backdrop
	  buildBD : function() {
	  	var _backdrop = document.getElementById('rglightbox-backdrop');

			if (!_backdrop) {
				// if backdrop doesn't exist then create it
				_backdrop           = document.createElement('div');
				_backdrop.className = 'rglightbox-backdrop rg-fade';
				_backdrop.id        = 'rglightbox-backdrop';
			}
			return _backdrop;
	  },

	  // show backdrop
	  showDB : function(callback) {
	  	var _backdrop = this.buildBD(),
	  	_that = this;
			// insert in document
			document.getElementsByTagName('body')[0].appendChild(_backdrop);
			// show
			window.setTimeout(function() {
				// animate
				_backdrop.className = _backdrop.className + ' rg-fadein';
				if (callback && typeof callback == 'function') {
					window.setTimeout(callback, _that.opts.transition);
				}
			}, 10);
	  },

	  // resize LB
	  resize: function(w, h) {
			var w = typeof w == 'number' ? w : parseInt(w, 10),
			y     = typeof y == 'number' ? h : parseInt(h, 10),
			_lb   = this.buildLB(),
			padding = parseInt( window.getComputedStyle(_lb).getPropertyValue('padding'), 10) || 0;
			// set size
			_lb.style.width  = w + 'px';
			_lb.style.height = h + 'px';
			// center lb
			_lb.style.position   = 'absolute';
			_lb.style.left       = '50%';
			_lb.style.top        = '50%';
			_lb.style.marginLeft = ((w / -2) -padding) + 'px';
			_lb.style.marginTop  = ((h / -2) -padding) + 'px';
	  },

	  // loading
	  loading: function(status) {
			var _lb   = this.buildLB();
			// resize LB
			this.resize(100, 100);
			// set spinner
			var spinner   = new Spinner(this.opts.spin).spin(_lb);
	  }
  });


  return RGlightbox;
});