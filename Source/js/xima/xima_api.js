/**
 * XIMA Javascript API
 *
 * @author Sebastian Gierth sgi@xima.de
 * @copyright xima media GmbH
 *
 * @version 1.9.0
 * @depends
 *		JavaScript 1.4
 *		jQuery 1.4.1
 *		google.maps 3.9
 *		OverlappingMarkerSpiderfier
 *		twbs bootstrap: tab.js v3.1.1
 *		OpenLayers v3.7.0
 */
var xima = {

	api: {

		/**
		 * @version 1.0.0
		 */
		responsiveImages: (function(window, document, $, undefined){

			/**
			 * selectors
			 * @var object
			 */
			var selectors = {};

			/**
			 * Set selectors for jQuery objects
			 * @param {string} wrapperSelector Selector of element that wraps the <img/>.
			 * @param {string} imageSelector   Selector of responsive <img/>.
			 * @return void
			 */
			function init(wrapperSelector, imageSelector) {

				selectors = {
					wrapper: wrapperSelector || 'body',
					image: imageSelector || 'img'
				};
			}

			/**
			 * Get sourceset and set the best fitting source as image.
			 * @return void
			 */
			function setResponsiveImages() {

				$(selectors.wrapper).each(function(){

					var $this = $(this);

					var wrapElement = {
						width: $this.width()
					};

					// Iterate through all <img/> of wrapper
					$(selectors.image, $(this)).each(function(){

						var $this = $(this);

						// Get sourceset by comma seperated data-attribute
						var srcsets = $this.data('srcset').split(',');

						// create objects from array of sourcesets
						var images = [];
						for (var i in srcsets){

							if (srcsets[i]) {

								images.push({
									src: /(?:.(?!\d+w))+/.exec(srcsets[i])[0].trim(),
									width: /(\d+)(?:w)/.exec(srcsets[i])[1]
								});
							}
						}

						// Sort ascending by width property
						images.sort(function(a, b){
							return a.width - b.width;
						});

						// Set the best fitting source as src-attribute
						for (var j in images){
							if (images[j].width >= wrapElement.width){
								$this.attr('src', images[j].src);
								$this.attr('width', wrapElement.width);
								break;
							}
							else if (j == images.length -1){
								$this.attr('src', images[j].src);
								$this.attr('width', wrapElement.width);
							}
						}
					});
				});
			}

			/**
			 * Event handler on resizing window.
			 */
			window.onresize = setResponsiveImages;

			/**
			 * Return public object
			 */
			return {
				run: function(wrapperSelector, imageSelector){

					init(wrapperSelector, imageSelector);
					setResponsiveImages();
				},
				refresh: function(){

					setResponsiveImages();
				}
			};

		})(window, document, jQuery),
		// end responsiveImages

		twitter: {
			bootstrap: function() {

				// error messages which shows on console
				var errors = {
					msg: {
						NoDefaultAnchor:   'Es wurde kein Standard-Anchor festgelegt!',
						NoFunctionTab:   'Die Funktion "tab" ist nicht definiert! Wurde tab.js (Twitter Bootstrap JS-PlugIn) eingefügt?'
					}
				};

				var selectedTabId = null;

				/**
				 * Select and shows a tab identified by URL-Anchor
				 * @param string default_anchor : the default anchor as fallback
				 * @param string selector_wrapper : jQuery-Selector of anchor tag wrapper
				 * @return false|true : true on success else false
				 */
				this.initTabs = function(default_anchor, selector_wrapper){
                    var anchor = '';

					if ( ! default_anchor){
						console.log(errors.msg.NoDefaultAnchor);
						return false;
					}

					var selector_wrapper = selector_wrapper || '';
					var queryString = document.URL.split('?')[1];

					if (queryString){
						queryString = queryString.split('#')[0];

	                    if (queryString) {
	                        var param, key;
	                        var params = queryString.split('&');
	                        for (key in params) {
	                            param = params[key].split('=');
	                            if (param[0] === 'tab') {
	                                anchor = param[1];
	                            }
	                        }
	                    }
					}

					if (anchor === ''){
						queryString = document.URL.split('/');
						for (var i=0; i<queryString.length; i++){
							if (queryString[i] === 'tab') {
								anchor = queryString[i+1];
							}
						}
					}

                    anchor = (anchor === '') ? default_anchor : anchor;

					var $anchor = jQuery(selector_wrapper +' a[href="#' + anchor + '"][data-toggle="tab"]');

					if ( ! $anchor.get(0)){
						$anchor = jQuery(selector_wrapper +' a[href="#' + default_anchor + '"][data-toggle="tab"]');
					}

					//keep the selected tab
					jQuery(selector_wrapper + ' a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
						selectedTabId = jQuery(e.target).attr('href').split('#')[1];
						});

					if (typeof $anchor.tab === 'function'){
						$anchor.tab('show');

						selectedTabId = $anchor.attr('href').split('#')[1];

						return true;
					}
					else {
						console.log(errors.msg.NoFunctionTab);
						return false;
					}

				};

				this.__defineGetter__("selectedTabId", function(){
			        return selectedTabId;
			    });

			    this.__defineSetter__("selectedTabId", function(val){
			    	selectedTabId = val;
			    }); // end tab

			} // end twitter.bootstrap

		}, // end twitter

		googlemaps: function()
		{
			var _map          = null;
			var _mapCanvas    = null;
			var _oms          = null;
			var _mapInit      = false;
			var _infoWindows  = [];
			var _markers      = [];
			var _polylines    = [];
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

			// @see possible OverlappingMarkerSpiderfier-Options on https://github.com/jawj/OverlappingMarkerSpiderfier
			var _omsOptions = {
				keepSpiderfied: true
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
			 * @param boolean useLatLngBounds (default=true)
			 * @param boolean useMarkerClusterer (default=true)
			 * @return this
			 */
			this.initGoogleMaps = function(useLatLngBounds, useMarkerClusterer){

				// if already initialized then return
				if (_mapInit === true){ return this; }

				// return if something is missing

				if ( ! _mapCanvas){
					console.log(errors.msg.MissingMapCanvas);
					return this;
				}

				// begin init

				_mapInit = true;

				_map = new google.maps.Map(_mapCanvas, _mapOptions);

				// init Layers
				for (var key in _mapLayers) {

					if (_mapLayers.hasOwnProperty(key)){
						_mapLayers[key].setMap(_map);
					}
				}

				return this;
			};

			/**
			 * Applies MapData
			 * @param boolean useLatLngBounds (default=true)
			 * @param boolean useMarkerClusterer (default=true)
			 */
			this.applyMapData = function(useLatLngBounds, useMarkerClusterer){

				if ( ! _map){
					console.log(errors.msg.MissingMap);
					return this;
				}

				if (jQuery.isEmptyObject(_mapData) || ! _mapData.points){
					console.log(errors.msg.MissingMapDataProperty);
					return this;
				}

				var useLatLngBounds = (typeof useLatLngBounds !== 'boolean') ? true : useLatLngBounds;
				var useMarkerClusterer = (typeof useMarkerClusterer !== 'boolean') ? true : useMarkerClusterer;

				if (useLatLngBounds){
					var bounds = new google.maps.LatLngBounds();
				}

				var lengthPoints = ( ! jQuery.isEmptyObject(_mapData) && _mapData.points) ? Object.keys(_mapData.points).length : 0;
				var layers = [];
				var myTitle;
				var myLatlng;
				var myIcon;
				var j;

				if (useMarkerClusterer){
					this.createOverlappingMarkerSpiderfier();
				}

				// init marker
				var currentLat;
				var currentLang;
				for (var i=0; i < lengthPoints; i++) {

					currentLat = parseFloat(_mapData.points[i].lat);
					currentLang = parseFloat(_mapData.points[i].lng);
					// skip non-existing coords
					if ( ! isNaN(currentLat) && ! isNaN(currentLang) ) {

                        myLatlng = new google.maps.LatLng(currentLat, currentLang);
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
			 * Sets MapData
			 * @param mapData : string | object | array The map data as json string, jquery selector string, array or object.
			 * @return this
			 */
			this.setMapData = function(mapData){

				//is it an array or object?
				if ((jQuery.type(mapData) === "array") || (jQuery.type(mapData) === "object"))
				{
					_mapData = mapData;
				}
				else if (jQuery.type(mapData) === "string")
				{
					json = mapData;
					//is there a dom element the holds json?
					if (jQuery(mapData).length !== 0)
					{
						json = jQuery(mapData).val();
					}

					try {
						//try to decode json
						_mapData = jQuery.parseJSON(json);

					} catch (e) {
						console.log(errors.msg.IsNotJson);
					}
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

				if (_oms){
					_oms.addMarker(_markers[j]);
				}

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

			/**
			 * Creates OverlappingMarkerSpiderfier
			 * @return this
			 */
			this.createOverlappingMarkerSpiderfier = function(){

				if (_map){
					_oms = new OverlappingMarkerSpiderfier(_map, _omsOptions);
				}
				return this;
			};

			// TODO : data-type verification before apply OMS-Options

			// /**
			//  * Sets OMS-Options
			//  * @return this
			//  */
			// this.setOMSOptions = function(options){

			// 	if (options){
			// 		if (xima.api.functions.convertDataType(options, _convertRules)){
			// 			_omsOptions = options;
			// 		}
			// 	}
			// 	return this;
			// };

			// /**
			//  * Adds further OMS-Options
			//  * @return this
			//  */
			// this.addOMSOptions = function(options){

			// 	if (options){
			// 		if (xima.api.functions.convertDataType(options, _convertRules)){
			// 			jQuery.extend(_omsOptions, options);
			// 		}
			// 	}
			// 	return this;
			// };

			/**
			 * Returns current MarkerClusterer-Options
			 * @return Object markerClustererOptions
			 */
			this.getOMSOptions = function(){
				return _omsOptions;
			};

			/**
			 * Draw new Polyline by coords with options and store it by key
			 * @param key Identifier of routecoords in _mapData
			 * @param routeCoords JSON of coords. If NULL then it looks into _mapData
			 * @param options PolylineOptions for google.maps.Polyline @see https://developers.google.com/maps/documentation/javascript/reference?hl=de-DE#PolylineOptions
			 * @return this
			 */
			this.drawPolyline = function(key, routeCoords, options){

				var path = [];

				if (routeCoords){
					_mapData.routes[key] = jQuery.parseJSON(routeCoords);
				}

				var lengthCoords = ( ! jQuery.isEmptyObject(_mapData) && ! jQuery.isEmptyObject(_mapData.routes) && _mapData.routes[key]) ? Object.keys(_mapData.routes[key]).length : 0;

				// init coords
				for (var i=0; i < lengthCoords; i++) {

					// skip non-existing coords
					if ( ! _mapData.routes[key][i].lat || ! _mapData.routes[key][i].lng) {
						continue;
					}

					path.push( new google.maps.LatLng(parseFloat(_mapData.routes[key][i].lat), parseFloat(_mapData.routes[key][i].lng)) );
				}

				// options
				var polylineOptions = {
					path:          path,
					strokeColor:   '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight:  2
				};

				if (options){
					// TODO : create convertRules (or other function to determine correct types)
					//if (xima.api.functions.convertDataType(options, convertRules)){
						jQuery.extend(polylineOptions, options);
					//}
				}

				_polylines[key] = new google.maps.Polyline(polylineOptions);

				if (_map){
					_polylines[key].setMap(_map);
				}

				return this;
			};

		},// end googlemaps

		openlayers: (function(window, document, $, undefined){

			/**
			 * selectors
			 * @var object
			 */
			var selectors = {};

			/**
			 * Array of {ol.Map}
			 * @type {Array}
             */
			var maps = [];

			/**
			 * Map class
			 * @param parameters
			 */
			var map = function(parameters){

				var _this = this;

				/**
				 * @type {ol.Map}
				 */
				this.map = new ol.Map({
					target: parameters.target
				});

				/**
				 * @param {ol.layer.Base} layer Layer.
				 */
				this.addLayer = function(layer){
					_this.map.addLayer(layer);
				};

				/**
				 * initialize
				 */
				this.initialize = function(){

					// Add base layer if provided
					if (parameters.hasOwnProperty('baseLayerUrl')){

						var baseLayer = new ol.layer.Tile({
							source: new ol.source.XYZ({
								attributions: [
									new ol.Attribution({
										html: parameters.attribution || ''
									})
								],
								tilePixelRatio: 2,
								url: parameters.baseLayerUrl
							}),
							name: 'baseLayer',
							title: 'Base Layer'
						});

						_this.map.addLayer(baseLayer);
					}

					// Set View
					if (parameters.hasOwnProperty('view')){

						var view = new ol.View({
							center: ol.proj.transform([parameters.view.lon, parameters.view.lat], 'EPSG:4326', 'EPSG:3857'),
							zoom: parameters.view.zoom || 7
						});

						_this.map.setView(view);
					}
				};

				this.initialize();
			};

			/**
			 * Set selectors for jQuery objects
			 * @param {string} wrapperSelector Selector of element that wraps the map.
			 * @param {string} mapSelector   Selector of map.
			 * @return void
			 */
			function initialize(wrapperSelector, mapSelector) {

				selectors = {
					wrapper: wrapperSelector,
					map: mapSelector
				};
			}

			/**
			 *
			 * @returns {Array}
             */
			function getArrayOfMaps(parameters) {

				$(selectors.wrapper).each(function(){
					$(selectors.map, $(this)).each(function(){

						maps.push(new map({
							target: $(this).get(0),
							baseLayerUrl: parameters.baseLayerUrl,
							view: parameters.view,
							attribution: parameters.attribution
						}));
					});
				});

				return maps;
			}

			/**
			 * Returns API-Object
			 */
			return {
				/**
				 *
				 * @param wrapperSelector
				 * @param mapSelector
				 * @param baseLayerUrl
				 * @param lat
                 * @param lon
                 * @param zoom
                 * @param attribution
                 * @returns {Array}
                 */
				createMaps: function(wrapperSelector, mapSelector, baseLayerUrl, lat, lon, zoom, attribution){

					initialize(wrapperSelector, mapSelector);
					return getArrayOfMaps({baseLayerUrl: baseLayerUrl, view: {lat: lat, lon: lon, zoom: zoom}, attribution: attribution});
				}
			}

		})(window, document, jQuery), // end openlayers

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
