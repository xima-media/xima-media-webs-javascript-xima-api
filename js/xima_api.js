/**
 * XIMA Javascript API
 *
 * @author Sebastian Gierth sgi@xima.de
 * @copyright xima media GmbH
 *
 * @version 1.4.0
 * @depends
 *		google.maps 3.9
 *		jQuery 1.4.1
 *		JavaScript 1.4
 */
var xima = {

	api: {

		twitter: {
			bootstrap: function() {

				// error messages which shows on console
				var errors = {
					msg: {
						NoDefaultAnchor:   'Es wurde kein Standard-Anchor festgelegt!'
					}
				};

				/**
				 * Select and shows a tab identified by URL-Anchor
				 * @param string default_anchor : the default anchor as fallback
				 * @param string selector_wrapper : jQuery-Selector of anchor tag wrapper
				 * @return false|true : true on success else false
				 */
				this.selectTab = function(default_anchor, selector_wrapper){

					if ( ! default_anchor){
						console.log(errors.msg.NoDefaultAnchor);
						return false;
					}

					var selector_wrapper = selector_wrapper || '';
					var anchor = document.URL.split('#')[1] || default_anchor;
					var $anchor = jQuery(selector_wrapper +' a[href="#' + anchor + '"][data-toggle="tab"]');

					if ( ! $anchor.get(0)){
						$anchor = jQuery(selector_wrapper +' a[href="#' + default_anchor + '"][data-toggle="tab"]');
					}

					if (typeof $anchor.tab == 'function'){
						$anchor.tab('show');
						return true;
					}
					else {
						console.log('Die Funktion "tab" ist nicht definiert! Wurde das tabs JavaScript plugin eingefügt?');
						return false;
					}

				} // end tab

			} // end twitter.bootstrap

		}, // end twitter

		googlemaps: function()
		{
			var _map          = null;
			var _mapCanvas    = null;
			var _mapInit      = false;
			var _infoWindows  = [];
			var _markers      = [];
			var _mapLayers    = {};
			var _mapData      = {}; // an Object like { 'points': [ { 'title': 'first_Marker' }, { 'title': 'second_Marker' } ] }
			var _convertRules = {
				backgroundColor:           'String',
				center:                    'google.maps.LatLng',
				disableDefaultUI:          'Boolean',
				disableDoubleClickZoom:    'Boolean',
				draggable:                 'Boolean',
				draggableCursor:           'String',
				draggingCursor:            'String',
				heading:                   'Number',
				keyboardShortcuts:         'Boolean',
				mapMaker:                  'Boolean',
				mapTypeControl:            'Boolean',
				mapTypeControlOptions:     'google.maps.MapTypeControlOptions',
				mapTypeId:                 'google.maps.MapTypeId',
				maxZoom:                   'Number',
				minZoom:                   'Number',
				noClear:                   'Boolean',
				overviewMapControl:        'Boolean',
				overviewMapControlOptions: 'google.maps.OverviewMapControlOptions',
				panControl:                'Boolean',
				panControlOptions:         'google.maps.PanControlOptions',
				rotateControl:             'Boolean',
				rotateControlOptions:      'google.maps.RotateControlOptions',
				scaleControl:              'Boolean',
				scaleControlOptions:       'google.maps.ScaleControlOptions',
				scrollwheel:               'Boolean',
				streetView:                'google.maps.StreetViewPanorama',
				streetViewControl:         'Boolean',
				streetViewControlOptions:  'google.maps.StreetViewControlOptions',
				styles:                    'google.maps.MapTypeStyle',
				tilt:                      'Number',
				zoom:                      'Number',
				zoomControl:               'Boolean',
				zoomControlOptions:        'google.maps.ZoomControlOptions'
			};

			// @see possible Map-Options on https://developers.google.com/maps/documentation/javascript/reference?hl=de-DE#MapOptions
			var _mapOptions = {
				center: new google.maps.LatLng(51.069660, 13.778158),
				zoom: 8
			};

			// error messages which shows on console
			var errors = {
				msg: {
					IsNotJson:              'Die angegebene Variable ist keine JSON!',
					MissingMapDataProperty: 'Dem MapData-Object fehlen die benötigten Eigenschaften!',
					MissingMapCanvas:       'Es wird ein Map-Canvas benötigt!',
					MissingMap:       		'Fehlende GoogleMaps Instanz!'
				}
			};

			/**
			 * Initilize Google Maps
			 */
			this.initGoogleMaps = function(useLatLngBounds){

				// if already initialized then return
				if (_mapInit === true){ return; }

				// return if something is missing

				if ( ! _mapCanvas){
					console.log(errors.msg.MissingMapCanvas);
					return;
				}

				// begin init

				_mapInit = true;

				_map = new google.maps.Map(_mapCanvas, _mapOptions);

				this.applyMapData(useLatLngBounds);

				// init Layers
				for (var key in _mapLayers) {

					if (_mapLayers.hasOwnProperty(key)){
						_mapLayers[key].setMap(_map);
					}
				}
			};

			/**
			 * Applies MapData
			 */
			this.applyMapData = function(useLatLngBounds){

				if ( ! _map){
					console.log(errors.msg.MissingMap);
					return this;
				}

				if (jQuery.isEmptyObject(_mapData) || ! _mapData.points){
					console.log(errors.msg.MissingMapDataProperty);
					return this;
				}

				var useLatLngBounds = (typeof useLatLngBounds !== 'boolean') ? true : useLatLngBounds;

				if (useLatLngBounds){
					var bounds = new google.maps.LatLngBounds();
				}

				var lengthPoints = ( ! jQuery.isEmptyObject(_mapData) && _mapData.points) ? Object.keys(_mapData.points).length : 0;
				var layers = [];
				var myTitle;
				var myLatlng;
				var myIcon;
				var j;

				// init marker
				for (var i=0; i < lengthPoints; i++) {

					// skip non-existing coords
					if ( ! _mapData.points[i].lat || ! _mapData.points[i].lng) {
						continue;
					}

					myLatlng = new google.maps.LatLng(parseFloat(_mapData.points[i].lat), parseFloat(_mapData.points[i].lng));
					myTitle  = (_mapData.points[i].title) ? _mapData.points[i].title : '';
					myIcon   = (_mapData.points[i].icon) ? _mapData.points[i].icon : null;

					this.addMarker(myLatlng, myTitle, myIcon);
					j = _markers.length -1;

					if (useLatLngBounds) {
						// extend the bounds to include each markers's position
						bounds.extend(_markers[j].position);
					}

					_markers[j].setMap(_map);
				}

				if (useLatLngBounds && _markers.length > 0){
					// now fit the map to the newly inclusive bounds
					_map.fitBounds(bounds);

					// max zoom
					var listener = google.maps.event.addListener(_map, "zoom_changed", function() {
						if (_map.getZoom() > _mapOptions.zoom) _map.setZoom(_mapOptions.zoom);
						google.maps.event.removeListener(listener);
					});
				}
			};

			/**
			 * Closes opening Infowindows
			 */
			this.closeInfoWindows = function()
			{
				if (_infoWindows.length > 0) {
					// detach the info-window from the marker ... undocumented in the API docs
					_infoWindows[0].set("marker", null);
					_infoWindows[0].close();
					_infoWindows.length = 0;
				}
			};

			/**
			 * Sets Google-Map-Options
			 * @return this
			 */
			this.setMapOptions = function(options){

				if (options){
					if (xima.api.functions.convertDataType(options, _convertRules)){
						_mapOptions = options;
					}
				}
				return this;
			};

			/**
			 * Adds further Google-Map-Options
			 * @return this
			 */
			this.addMapOptions = function(options){

				if (options){
					if (xima.api.functions.convertDataType(options, _convertRules)){
						jQuery.extend(_mapOptions, options);
					}
				}
				return this;
			};

			/**
			 * Returns current Google-Map-Options
			 * @return Object mapOptions
			 */
			this.getMapOptions = function(){
				return _mapOptions;
			};

			/**
			 * Sets MapData as from JSON
			 * @param mapData : Data as JSON | jQuery-Selector of element which have got JSON-Data in value-Attribute
			 * @param isJson : if true then mapData expects as JSON
			 * @return this
			 */
			this.setMapData = function(mapData, isJson){

				try {
					if (isJson == true) {
						_mapData = jQuery.parseJSON(mapData);
					}
					else {
						_mapData = jQuery.parseJSON(jQuery(mapData).val());
					}
				} catch (e){
					console.log(errors.msg.IsNotJson);
				}

				if (jQuery.isEmptyObject(_mapData) || ! _mapData.points){
					console.log(errors.msg.MissingMapDataProperty);
				}
				else if (_mapData.mapOptions){
					this.addMapOptions(_mapData.mapOptions);
				}

				return this;
			};

			/**
			 * Sets element in where the map should be display (Map-Canvas)
			 * @param mapCanvas : jQuery-Selector of element
			 * @return this
			 */
			this.setMapCanvas = function(mapCanvas){

				_mapCanvas = jQuery(mapCanvas).get(0);
				return this;
			};

			/**
			 * Adds .kml-files
			 * @param Object kml : an object of .kml-file associated by a key (e.g. {key_1: 'path/to/kml'} )
			 * @return this
			 *
			 * @see kml-notes on https://developers.google.com/kml/documentation/kmlelementsinmaps?hl=de-DE&csw=1
			 */
			this.addLayers = function(kml){

				if (typeof kml === 'object'){
					for (var key in kml) {
						_mapLayers[key] = new google.maps.KmlLayer({
							url: kml[key],
							preserveViewport: true
						});
					}
				}
				return this;
			};

			/**
			 * Remove Layer by key
			 * @return this
			 */
			this.removeLayer = function(key){

				if (key && _mapLayers.key){
					delete _mapLayers.key;
				}
				return this;
			};

			/**
			 * Add a marker to the map and push to the array
			 * @param location (google.maps.LatLng)
			 * @param title
			 * @param icon
			 * @return this
			 */
			this.addMarker = function(location, title, icon, windowContent){

				if ( ! _map){
					console.log(errors.msg.MissingMap);
					return this;
				}

				var self = this;

				_markers.push( new google.maps.Marker({
					position: location,
					title:    title,
					icon:     icon,
					map:      _map
				}) );

				j = _markers.length -1;

				if (windowContent !== false){

					var windowContent = (windowContent) ? windowContent : _mapData.points[j].windowContent;

					google.maps.event.addListener(_markers[j], 'click', function(k){

						return function(){
							self.closeInfoWindows();

							var infoWindow = new google.maps.InfoWindow({
								content: windowContent
							});
							infoWindow.open(_map, _markers[k]);

							_infoWindows[0] = infoWindow;
						};
					}(j));
				}

				return this;
			};

			/**
			 * Sets Map for all markers
			 * @param map google.maps.Map|null to clear
			 * @return this
			 */
			this.setAllMarkersMap = function(map){

				for (var i = _markers.length -1; i >= 0; i--) {
					_markers[i].setMap(map);
				}
				return this;
			};

			/**
			 * Removes the markers from the map, but keeps them in the array
			 * @return this
			 */
			this.clearMarkers = function(){
				this.setAllMarkersMap(null);
				return this;
			};

			/**
			 * Deletes all markers in the array by removing references to them
			 * @return this
			 */
			this.deleteMarkers = function(){
				this.clearMarkers();
				_markers = [];
				return this;
			};

			/**
			 * Shows any markers currently in the array
			 * @return this
			 */
			this.showMarkers = function(){
				if (_map){
					this.setAllMarkersMap(_map);
				}
				return this;
			};

		},// end googlemaps

		functions: {

			/**
			 * Converts data to datatype defined in convertRules using 'instanceof' for compare
			 * @param mixed data : data as Object which will be converted
			 * @param object convertRules : key-value-object defining the converting rules like { property : constructor }; (property should be the propertyname of data-Object)
			 * @return false|true : true on success else false
			 */
			convertDataType: function(data, convertRules){

				if ( ! convertRules || typeof data !== 'object'){
					return false;
				}

				var success = true;

				for (var data_key in data){
					if ( ! convertRules[data_key]) continue;

					var classes = convertRules[data_key].split('.');
					var className;

					className = window[classes[0]];
					for (var i=1; i<classes.length; i++){
						className = className[classes[i]];
					}

					if (data[data_key] instanceof className || typeof data[data_key] === className){
						continue;
					}

					if (typeof data[data_key] !== className){
						try {
							data[data_key] = className(data[data_key]);
						} catch (e) {
							try {
								data[data_key] = new className();
							} catch(e) {
								console.log('Cannot convert '+ data[data_key] +' to '+ className);
								success = false;
							}
						}
					}
				}

				return success;
			}
		} // end functions
	}
};