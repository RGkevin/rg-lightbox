/*!
 * RG Lightbox 0.0.1
 * http://rgkevin.it
 * MIT licensed
 *
 * Copyright (C) 2013 @RGkevin
 */

(function(root, factory) {

	/* CommonJS */
  if (typeof exports == 'object')  {
  	module.exports = factory()
	}
  /* AMD module */
  else if (typeof define == 'function' && define.amd) {
  	define(['spin'], factory)
  }
  /* Browser global */
  else {
  	root.RGlightbox = factory( root.Spinner );
  	/*Auto Load RGlightbox for non AMD users*/
  	// root.RGlightboxElements = new RGlightbox(window.document.querySelectorAll(['[data-lightbox]']));
  }

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

  /**
   * Prevent Default for events
   */

  function preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	/**
   * Filter method for Array *IE fix
   */

	if (!Array.prototype.filter) {
	  Array.prototype.filter = function(fun /*, thisp*/) {
	    'use strict';

	    if (!this) {
	      throw new TypeError();
	    }

	    var objects = Object(this);
	    var len = objects.length >>> 0;
	    if (typeof fun !== 'function') {
	      throw new TypeError();
	    }

	    var res = [];
	    var thisp = arguments[1];
	    for (var i in objects) {
	      if (objects.hasOwnProperty(i)) {
	        if (fun.call(thisp, objects[i], i, objects)) {
	          res.push(objects[i]);
	        }
	      }
	    }

	    return res;
	  };
	}

  // Built-in defaults

  var defaults = {
  	transition: 350,				// transition duration
  	prevText : 'left',			// texto for left button
  	nextText : 'right',     // texto for right button
  	spin : {
  		top: 50,
  		left: 50
  	}								// default for spin
  }

  /* Constructor */
  function RGlightbox(options) {
  	if (typeof this == 'undefined') return new RGlightbox(options);
  	// auto select all a elements with the data-lightbox attr
		this.elements = window.document.querySelectorAll(['a[data-lightbox]']);
  	// extends defaults
    this.opts = merge(options || {}, RGlightbox.defaults, defaults);
  	// start RGlightbox
  	this.init();
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {};

  /**
   * Build Prototype
   */

  merge(RGlightbox.prototype, {

  	// start everything
  	init: function (){
  		// create galleries
  		this.createGalleries(this.elements);
  		// bind events
  		this.bind(this.elements);
  	},

  	// destroy lightbox
  	destroy: function() {
  		console.log('se va a destruir');
  		console.log(this.elements);
  		this.bind(this.elements, true);
  	},

  	// show gallery
  	showGallery: function(gallery, url) {
			var _that               = this,
			_gallery                = this.getGalleryDataByName(gallery);
			_gallery._startImage    = _gallery.urls.indexOf(url);
			_gallery._galleryLength = _gallery.urls.length - 1;

  		// start lightbox
  		this.showLB();
  		// build controlls
  		this.buildControlls();
  		// load firts image
  		this.showImageOfGallery(_gallery.urls, _gallery._startImage);
  		// set controlls events
  		this.bindControlls(gallery);
  	},

  	// show individual Image
  	showImage: function(url) {
  		// start lightbox
  		this.showLB();
  		// load image
  		this.showImageOfGallery([url], 0);
  		// build close button
  		this.buildControlls('close');
  		// set close event
  		this.bindControlls('close');
  	},

  	// close lightbox
  	close: function() {
  		var _that = this,
  		_lightbox = this.buildLB(),
  		_lbContainer = window.document.getElementById('rglightbox-container'),
  		_lbBackdrop = window.document.getElementById('rglightbox-backdrop'),
  		_body = window.document.getElementsByTagName('body')[0],
  		_newClassName = _lightbox.className.replace(' rg-fadein', '')
  		_lightbox.className = _newClassName;
  		window.setTimeout(function() {
  			_body.removeChild(_lbContainer);
  			_newClassName = _lbBackdrop.className.replace(' rg-fadein', '');
  			_lbBackdrop.className = _newClassName;
  			window.setTimeout(function() {
	  			_body.removeChild(_lbBackdrop);
  			}, _that.opts.transition);
  			// _body.removeChild(_lbBackdrop);
  		}, this.opts.transition);
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
			var newRGlightbox      = this.buildLB(),
			// container
			newContainer           = document.getElementById('rglightbox-container') || document.createElement('div');
			newContainer.id        = 'rglightbox-container';
			newContainer.className = 'rglightbox-container';
			newContainer.appendChild(newRGlightbox);
	  	// add lightbox container structure to document
			document.getElementsByTagName("body")[ 0 ].appendChild(newContainer);
  		// show backdrop
  		this.showDB(function(){
				// show lightbox when BD loads
				newRGlightbox.className = newRGlightbox.className + ' rg-fadein';
			});
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

	  // build controls
	  buildControlls: function(method){
			var _lightbox  = this.buildLB(),
			_left          = _lightbox.getElementsByClassName('rglightbox-left')[0],
			_right         = _lightbox.getElementsByClassName('rglightbox-right')[0],
			_close         = _lightbox.getElementsByClassName('rglightbox-close')[0];
			this.controlls = [];

			if (!_left && method !== 'close') {
				// creating left control
				_left         = window.document.createElement('a');
				_left.textContent  = this.opts.prevText;
				_left.className    = 'rglightbox-left';
				_lightbox.appendChild(_left);
			}

			if (!_right && method !== 'close') {
				_right = window.document.createElement('a');
				// creating right control
				_right.textContent = this.opts.nextText;
				_right.className   = 'rglightbox-right';
				_lightbox.appendChild(_right);
			}
			if (!_close) {
				_close = window.document.createElement('a');
				// creating close control
				_close.textContent = '×'; //×
				_close.className   = 'rglightbox-close';
				_close.title       = 'Close';
				_lightbox.appendChild(_close);
			}
			this.controlls = [_left, _right, _close];
	  },

	  // bind events to controlls
	  bindControlls: function(gallery) {
			var _that = this,
			_buttons  = this.controlls,
			_prevBtn  = _buttons[0],
			_nextBtn  = _buttons[1],
			_closeBtn = _buttons[2];

			if (gallery !== 'close') {

		  	// set prev event
		  	_prevBtn.addEventListener('click', function(event) {
		  		var _gallery = _that.getGalleryDataByName(gallery),
		  		_newStartImage;
		  		if (_gallery._startImage > 0) {
			  		_newStartImage = --_that.getGalleryDataByName(gallery)._startImage;
		  		} else {
		  			_newStartImage = _that.getGalleryDataByName(gallery)._startImage = _gallery._galleryLength;
		  		}
		  		_that.showImageOfGallery(_gallery.urls, _newStartImage);
		  		preventDefault(event);
		  	});

		  	// set next event
		  	_nextBtn.addEventListener('click', function(event) {
		  		var _gallery = _that.getGalleryDataByName(gallery),
		  		_newStartImage;
		  		if (_gallery._startImage < _gallery._galleryLength) {
			  		_newStartImage = ++_that.getGalleryDataByName(gallery)._startImage;
		  		} else {
		  			_newStartImage = _that.getGalleryDataByName(gallery)._startImage = 0;
		  		}
		  		_that.showImageOfGallery(_gallery.urls, _newStartImage);
		  		preventDefault(event);
		  	});
			}

	  	// set close event
	  	_closeBtn.addEventListener('click', function(event) {
	  		_that.close();
	  		preventDefault(event);
	  	});
	  },

	  // show image of gallery
		showImageOfGallery:function(urls, index) {
			var _that = this;
			// remove current image if exists
			this.removeCurrentImage(function(){
				_that.loading().start(); // start loading state
				// build new image
				var image = window.document.createElement('img');
				image.addEventListener('load', function(event) {
					_that.loading().stop(); // stop loadin state
					_that.resize(this.width, this.height); // resize lightbox
					_that.buildLB().appendChild(this); // add image
				});
				image.src = urls[index];
			});
		},

		// remove current image
		removeCurrentImage: function(callback){
			var _lightbox = this.buildLB(),
			_image = _lightbox.getElementsByTagName('img')[0];
			// if image exists
			if (_image) {
				// -- add fade animation
				_image.className = 'rg-fade';
				// remove
				window.setTimeout(function(){
					_lightbox.removeChild(_image);
					if (typeof callback === 'function') callback();
				}, this.opts.transition);
			} else {
				if (typeof callback === 'function') callback();
			}
		},

	  // resize LB
	  resize: function(w, h) {
			var w = typeof w == 'number' ? w : parseInt(w, 10),
			y     = typeof y == 'number' ? h : parseInt(h, 10),
			_lb   = this.buildLB(),
			_lbStyles = window.getComputedStyle(_lb),
			padding = parseInt( _lbStyles.getPropertyValue('padding'), 10) || 0,
			sizing = _lbStyles.getPropertyValue('box-sizing') || null;
			// set size
			if (!sizing || sizing !== 'border-box' ) {
				_lb.style.width  = w + 'px';
				_lb.style.height = h + 'px';
			} else {
				_lb.style.width  = w + (padding * 2) + 'px';
				_lb.style.height = h + (padding * 2) + 'px';
			}
			// center lb
			_lb.style.position   = 'absolute';
			_lb.style.left       = '50%';
			_lb.style.top        = '50%';
			_lb.style.marginLeft = ((w / -2) -padding) + 'px';
			_lb.style.marginTop  = ((h / -2) -padding) + 'px';
	  },

	  // loading
	  loading: function() {
			var _that = this,
			_lb = _that.buildLB();
			return {
				start: function(){
					// set loading class
					_lb.className = _lb.className + ' rglightbox-loading';
					// resize LB
					_that.resize(100, 100);
					// set spinner
					var spinner   = _lb.getElementsByClassName('spinner')[0] ? null : new Spinner(_that.opts.spin).spin(_lb);
				},
				stop: function() {
					var _newClassName = _lb.className.replace(' rglightbox-loading', ' '); // remove loading class
					if( _lb.getElementsByClassName('spinner')[0] ) {
						_lb.removeChild( _lb.getElementsByClassName('spinner')[0] || [] ); // remove spinner
					}
					_lb.className = _newClassName; // remove loading class name
				}
			}
	  },

	  // create galleries
	  createGalleries: function(elements){
			var galleries  = [];
			this.galleries = [];
		  // get array of gallery names
	  	for (var i = 0, len = elements.length; i < len; i++) {
	  		if(elements[i].getAttribute('data-lightbox') !== "") galleries.push( elements[i].getAttribute('data-lightbox') || '' );
	  	}
	  	// remove duplicated elements
	  	galleries = galleries.filter(function(elem, pos, self) {
			    return self.indexOf(elem) == pos;
			});
			// return array of urls based on gallery name
			function getUrls(gallery){
				var _urls = []; // temp urls variable

		  	for (var i = 0, len = elements.length; i < len; i++) {
		  		if (elements[i].getAttribute('data-lightbox') === gallery) _urls.push(elements[i].href);
		  	}

				return _urls;
			}
			// storing galleries
			for (var i = 0, len = galleries.length; i < len; i++) {
				// add new gallery
				this.galleries.push({
					name: galleries[i],
					urls: getUrls(galleries[i])
				});
			}
	  },

	  // get gallery
	  getGalleryDataByName: function(gallery) {
	  	var _that = this;
  		for (var i = 0, len = this.galleries.length; i < len; i++) {
  			if(this.galleries[i].name === gallery) {
  				return this.galleries[i];
  			}
  		}
  		return null;
	  },

	  // bind events
	  bind:function(elements, destroy) {
	  	var _that = this,
	  	_click;

	  	_click = function(event) {
	  			if (_that.validateImage(this.href)) { // validate image url
		  			if (this.getAttribute('data-lightbox') !== '') {
		  				// show gallery
		  				_that.showGallery(this.getAttribute('data-lightbox'), this.href);
		  			} else {
		  				// show individual image
		  				_that.showImage(this.href);
		  			}
	  			} else {
	  				this.removeEventListener('click', _click, false);
	  			}
	  			preventDefault(event);

	  	};

	  	// unbind click event
	  	if (destroy) {
		  	for (var i = 0, len = elements.length; i < len; i++) {
		  		elements[i].removeEventListener('click', _click, false);
		  	}
		  	return;
	  	}

	  	// bind click event
	  	for (var i = 0, len = elements.length; i < len; i++) {
	  		elements[i].addEventListener('click', _click, false);
	  	}
	  },

	  // validate image
  	validateImage: function(url) {
  		if (typeof url === "string" && url.length > 0) {
  			return url;
  		} else {
  			window.alert('There was an error validating the image. Press ok to close lightbox.');
  			return false;
  		}
  	}
  });

  return RGlightbox;
});