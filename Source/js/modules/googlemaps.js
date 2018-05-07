/**
 * GoogleMaps API integration
 *
 * @author Sebastian Gierth <sgi@xima.de>, Steve Lenz <sle@xima.de>
 * @version 1.0.0
 * @depends
 *        google.maps 3.9
 *
 */
XIMA.api.googlemaps = (function(window, document, $, undefined) {

    var EXT = {};

    EXT.Map = function() {

        var me            = this;
        var _map          = null;
        var _mapCanvas    = null;
        var _oms          = null;
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
        var _mapOptions = null;

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

            this.getMapOptions();

            // if already initialized then return
            // if already initialized then return
            if ($(_mapCanvas).data("map-initialized") && $(_mapCanvas).data("map-initialized") === true) {
                return this;
            }

            // return if something is missing

            if ( ! _mapCanvas){
                console.log(errors.msg.MissingMapCanvas);
                return this;
            }

            // begin init

            $(_mapCanvas).data("map-initialized", true);

            _map = new google.maps.Map(_mapCanvas, this.getMapOptions());
            this.applyMapData(useLatLngBounds, useMarkerClusterer);

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
                    if (_map.getZoom() > me.getMapOptions.zoom) _map.setZoom(me.getMapOptions.zoom);
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
                if (this.convertDataType(options, _convertRules)){
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
                if (this.convertDataType(options, _convertRules)){
                    jQuery.extend(this.getMapOptions, options);
                }
            }
            return this;
        };

        /**
         * Converts data to datatype defined in convertRules using 'instanceof' for compare
         * @param mixed data : data as Object which will be converted
         * @param object convertRules : key-value-object defining the converting rules like { property : constructor }; (property should be the propertyname of data-Object)
         * @return false|true : true on success else false
         */
        this.convertDataType = function(data, convertRules){

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
        };

        /**
         * Returns current Google-Map-Options
         * @return Object mapOptions
         */
        this.getMapOptions = function(){

            if (typeof _mapOptions != google.maps) {
                _mapOptions = {
                    center: new google.maps.LatLng(51.069660, 13.778158),
                    zoom: 8
                };
            }

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
                var keepTryingDecodeJson = true;
                while (keepTryingDecodeJson){
                    try {
                        _mapData = jQuery.parseJSON(json);
                    } catch (e) {
                        if (jQuery(mapData).length !== 0){
                            json = jQuery(mapData).val();
                            continue;
                        }
                        else {
                            console.log(errors.msg.IsNotJson);
                        }
                    }
                    keepTryingDecodeJson = false;
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

            window.initOverlappingMarkerSpiderfier();

            if (_map){
                _oms = new OverlappingMarkerSpiderfier(_map, _omsOptions);
            }

            return this;
        };

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
                jQuery.extend(polylineOptions, options);
            }

            _polylines[key] = new google.maps.Polyline(polylineOptions);

            if (_map){
                _polylines[key].setMap(_map);
            }

            return this;
        };
    };

    return EXT;

})(window, document, jQuery);
