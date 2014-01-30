/**
 * XIMA Javascript API
 *
 * @author Sebastian Gierth sgi@xima.de
 * @copyright xima media GmbH
 *
 * @version 1.0.0
 * @depends
 *		google.maps v3.9
 *		jQuery v1.4.1
 */
var xima = {

 	api: {
		googlemaps: function()
		{
			var _map         = null;
			var _mapCanvas   = null;
			var _mapInit     = false;
			var _infoWindows = [];
			var _mapLayers   = {};
			var _mapData     = {};

			// @see possible Map-Options on https://developers.google.com/maps/documentation/javascript/reference?hl=de-DE#MapOptions
			var _mapOptions = {
				center:  new google.maps.LatLng(51.069660, 13.778158),
				zoom: 8
			};

			// error messages which shows on console
			var errors = {
				msg: {
					IsNotJson:              'Die angegebene Variable ist keine JSON!',
					MissingMapDataProperty: 'Dem MapData-Object fehlen die benötigten Eigenschaften!',
					MissingMapCanvas:       'Es wird ein Map-Canvas benötigt!'
				}
			};

			/**
			 * Initilize Google Maps
			 */
			this.initGoogleMaps = function(useLatLngBounds){

				var self = this;

				// if already initialized then return
				if (_mapInit == true){ return; }

				// return if something is missing

				if ( ! _mapCanvas){
					console.log(errors.msg.MissingMapCanvas)
					return
				}

				// begin init

				_mapInit = true;

				_map = new google.maps.Map(_mapCanvas, _mapOptions);


				var useLatLngBounds = (typeof useLatLngBounds !== 'boolean') ? true : useLatLngBounds;

				if (useLatLngBounds){
					var bounds = new google.maps.LatLngBounds();
				}

				var lengthPoints = ( ! jQuery.isEmptyObject(_mapData) && _mapData.points) ? Object.keys(_mapData.points).length : 0;
				var marker = [];
				var layers = [];
				var myTitle;
				var myLatlng;
				var myIcon;

				// init marker
				for (var i=0; i < lengthPoints; i++) {

					// skip non-existing coords
					if ( ! _mapData.points[i].lat || ! _mapData.points[i].lng) {
						continue;
					}

					myLatlng = new google.maps.LatLng(parseFloat(_mapData.points[i].lat), parseFloat(_mapData.points[i].lng));
					myTitle  = (_mapData.points[i].title) ? _mapData.points[i].title : '';
					myIcon   = (_mapData.points[i].icon) ? _mapData.points[i].icon : null;

					marker[i] = new google.maps.Marker({
						position: myLatlng,
						title:    myTitle,
						icon:     myIcon,
						map:      _map
					});

					if (useLatLngBounds) {
						// extend the bounds to include each marker's position
						bounds.extend(marker[i].position);
					}

					if (_mapData.points[i].windowContent){

						google.maps.event.addListener(marker[i], 'click', function(j){

							return function(){
								self.closeInfoWindows();

								var infoWindow = new google.maps.InfoWindow({
									content: _mapData.points[j].windowContent
								});
								infoWindow.open(_map, marker[j]);

								_infoWindows[0] = infoWindow;
							}
						}(i));
					}

					marker[i].setMap(_map);
				}

				if (useLatLngBounds && marker.length > 0){
					// now fit the map to the newly inclusive bounds
					_map.fitBounds(bounds);

					// max zoom
					var listener = google.maps.event.addListener(_map, "zoom_changed", function() {
						if (_map.getZoom() > _mapOptions.maxZoom) _map.setZoom(_mapOptions.maxZoom);
						google.maps.event.removeListener(listener);
					});
				}

				// init Layers
				for (var key in _mapLayers) {

					if (_mapLayers.hasOwnProperty(key)){
						_mapLayers[key].setMap(_map);
					}
				}
			}

			/**
			 * Closes opening Infowindows
			 */
			this.closeInfoWindows = function()
			{
				if (_infoWindows.length > 0) {
					// detach the info-window from the marker ... undocumented in the API docs
					_infoWindows[0].set("marker", null);
					// and close it
					_infoWindows[0].close();
					// blank the array
					_infoWindows.length = 0;
				}
			};

			/**
			 * Sets Google-Map-Options
			 * @return this
			 */
			this.setMapOptions = function(options){

				if (options){
					_mapOptions = options;
				}
				return this;
			}

			/**
			 * Adds further Google-Map-Options
			 * @return this
			 */
			this.addMapOptions = function(options){

				if (options){
					jQuery.extend(_mapOptions, options);
				}
				return this;
			}

			/**
			 * Returns current Google-Map-Options
			 * @return Object mapOptions
			 */
			this.getMapOptions = function(){
				return _mapOptions;
			}

			/**
			 * Sets MapData as from JSON
			 * @param mapData : Data as JSON | jQuery-Selector of element which have got JSON-Data in value-Attribute
			 * @param isJson : if true then mapData expects as JSON
			 * @return this
			 */
			this.setMapData = function(mapData, isJson){

				try {
					if (isJson == true) {
						_mapData = jQuery.parseJSON(mapData)
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

				return this;
			}

			/**
			 * Sets element in where the map should be display (Map-Canvas)
			 * @param mapCanvas : jQuery-Selector of element
			 * @return this
			 */
			this.setMapCanvas = function(mapCanvas){

				_mapCanvas = jQuery(mapCanvas).get(0);
				return this;
			}

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
			}

			/**
			 * Remove Layer by key
			 * @return this
			 */
			this.removeLayer = function(key){

				if (key && _mapLayers.key){
					delete _mapLayers.key;
				}
				return this;
			}
		}
	}
};