/*!
 * XIMA Javascript API
 *
 * @author XIMA MEDIA GmbH
 * @licence MIT
 * @version 2.1.0
 */
var XIMA = {
    api: {
    }
};

/**
 * respimg.js - A javascript to choose the best fitting image for responsive design
 *
 * @author Sebastian Gierth <sgi@xima.de>
 * @version 1.0.0
 * @depends
 *        jQuery 1.4.1
 *        google.maps 3.9
 *        OverlappingMarkerSpiderfier
 *        twbs bootstrap: tab.js v3.1.1
 *        OpenLayers v3.7.0
 *
 */
XIMA.api.openlayers = (function (window, document, $, undefined) {

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
    var map = function (parameters) {

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
        this.addLayer = function (layer) {
            _this.map.addLayer(layer);
        };

        /**
         * initialize
         */
        this.initialize = function () {

            // Add base layer if provided
            if (parameters.hasOwnProperty('baseLayerUrl')) {

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
            if (parameters.hasOwnProperty('view')) {

                jQuery.extend(parameters.view, {
                    center: ol.proj.transform([parameters.view.lon, parameters.view.lat], 'EPSG:4326', 'EPSG:3857'),
                    zoom: parameters.view.zoom || 7
                });

                var view = new ol.View(parameters.view);

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

        $(selectors.wrapper).each(function () {
            $(selectors.map, $(this)).each(function () {

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
         * @param view
         * @param attribution
         * @returns {Array}
         */
        createMaps: function (wrapperSelector, mapSelector, baseLayerUrl, view, attribution) {

            initialize(wrapperSelector, mapSelector);
            return getArrayOfMaps({baseLayerUrl: baseLayerUrl, view: view, attribution: attribution});
        }
    }

})(window, document, jQuery);

/**
 * respimg.js - A javascript to choose the best fitting image for responsive design
 *
 * @author Sebastian Gierth <sgi@xima.de>
 * @version 1.0.0
 * @depends
 * 		jQuery 1.4.1
 *
 */
XIMA.api.responsiveImages = (function(window, document, $, undefined){

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
                    else if (j === images.length -1){
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

})(window, document, jQuery);
