/*!
 * RG Lightbox 0.0.1
 * http://rgkevin.it
 * MIT licensed
 *
 * Copyright (C) 2013 @RGkevin
 */

(function(root) {

	var _rglightbox = function() {
		'use strict';

		// # build object

		var options = {
			transition : 350
		}

		// define data

		this.__defineGetter__("fading", function(){
			var _lb = this._build(),
			_lbStyles = window.getComputedStyle(_lb),
			_transition = parseFloat(_lbStyles.getPropertyValue('transition-duration') || '0.0s' ) * 1000;
			console.log('se quiere accesar al dato fading', _transition);
			return _transition;
		});

		this._init();

		// # Show Lightbox

	}

	// # Init Core

	_rglightbox.prototype.constructor = _rglightbox;

	_rglightbox.prototype._init = function() {

		//build backdrop
		// this._buildBD();

		//build lightbox
		// this._build();

		console.log('se inicio :3');
	}

	// # Show Lightbox

	_rglightbox.prototype._show = function() {
		var _that = this;
		// show BD
		this._showBD(function(){
			// show lightbox container when BD loads
			_that._showLB()
		});
	}

	// # Show LB

	_rglightbox.prototype._showLB = function() {
		var _lightbox = this._build();
		window.setTimeout(function() {
			_lightbox.className = _lightbox.className + ' rg-fadein';
		}, 10);
		console.log('ahora se mostrara el lb', _lightbox);
	}

	// # Show BackDrop

	_rglightbox.prototype._showBD = function(callback) {
		var _that = this;

		console.log('el valor del fading es', this.fading);

		var _backdrop = this._buildBD();

		// show
		window.setTimeout(function() {
			// animate
			_backdrop.className = _backdrop.className + ' rg-fadein';
			if (callback && typeof callback == 'function') {
				console.log('se correra', callback);
				console.log('en.. ', _that.fading);
				window.setTimeout(callback, _that.fading);
			}
		}, 10);

	}

	// # Build Lightbox

	_rglightbox.prototype._build = function() {
		'use strict';

		var newRGlightbox = window.document.getElementById('rglightbox');

		if (!newRGlightbox) {

			console.log('se construira');

			newRGlightbox = document.createElement('div');

			var newContainer = document.createElement('div'),
			newController    = document.createElement('div'),
			newInfo          = document.createElement('div');

			// rglightbox

			newRGlightbox.className = 'rglightbox rg-fade';
			newRGlightbox.id        = 'rglightbox';

			// container

			newContainer.id = 'rglightbox-container';
			newContainer.className = 'rglightbox-container';
			newContainer.appendChild(newRGlightbox);

			// add lightbox structure to document

			document.getElementsByTagName("body")[ 0 ].appendChild(newContainer);

		}

		return newRGlightbox;
	}

	// # Build backdrop

	_rglightbox.prototype._buildBD = function() {
		var _backdrop       = document.getElementById('rglightbox-backdrop');

		if (!_backdrop) {
			// if backdrop doesn't exist then create it
			console.log('no existe backdrop crearlo');
			_backdrop           = document.createElement('div');
			_backdrop.className = 'rglightbox-backdrop rg-fade';
			_backdrop.id        = 'rglightbox-backdrop';
			// insert in document
			document.getElementsByTagName('body')[0].appendChild(_backdrop);
		}
		return _backdrop;
	}

	// # Create a single view

	_rglightbox.prototype.create = function(first_argument) {
		'use strict';
		// body...
	};

	// # Create a Gallery

	_rglightbox.prototype.createGallery = function(first_argument) {
		'use strict';
		// body...
	};

	// # Constructor

	_rglightbox.prototype.constructor = _rglightbox;

	// define global
	root.RGlightbox = _rglightbox;
})(this);