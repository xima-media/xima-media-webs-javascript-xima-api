/**
 * xm_dsgvo.js – A javascript to handle privacy conform user interaction with maps
 *
 * @author Konrad Michalik <kmi@xima.de>
 * @version 1.0.0
 *
 *
 */
XIMA.api.dsgvo = (function(window, document, $, undefined) {

    var EXT = {};

    var _namespace = 'XIMA.api.dsgvo';
    var _mapStorageIdentifier = 'ximaMapState';
    var _classCanvasHint = 'js-map-hint';
    var _selectorCanvasHint = '.' + _classCanvasHint;
    var _isMapActivated = false;

    var _config = {
        map:    {
            // enable logging
            debug:                  false,
            // selector of map script url element within attribute 'data-url'
            scriptUrlSelector:      '.map-script-url',
            // use global setting for activate/deactivate maps integration
            useGlobal:              false,
            // enable maps activation for canvas elements
            useCanvasHint:          true,
            // use checkbox to switch global setting
            switchElement:          null,
            // map canvas elements
            canvasElements:     [],
            // callback
            callback:               function() {

            },
            // styling
            canvasHint: {
                msg:                    'Karten sind standardmäßig deaktiviert. Klicken Sie hier, um den Datenschutzbestimmungen zuzustimmen und die Karte anzeigen zu lassen.',
                style: {
                    backgroundColor:    'rgba(0,0,0,0.5)',
                    textColor:          '#dddddd',
                    textSize:           '12px',
                    iconUrl:            null
                },
                className: null
            }
        }
    };

    // default svg forbidden icon
    var _svgIcon = '<?xml version="1.0" encoding="iso-8859-1"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="forbidden-icon" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510; width: 50px; margin-bottom: 20px;" xml:space="preserve"><path d="M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M51,255c0-112.2,91.8-204,204-204    c45.9,0,89.25,15.3,124.95,43.35l-285.6,285.6C66.3,344.25,51,300.9,51,255z M255,459c-45.9,0-89.25-15.3-124.95-43.35    L415.65,130.05C443.7,165.75,459,209.1,459,255C459,367.2,367.2,459,255,459z" fill="#FFFFFF"/></svg>';

    /**
     * Initialize dsgvo.js
     * @return this
     * @param parameters
     */
    EXT.initialize = function(parameters){

        // load additional parameters
        if (parameters) {
            jQuery.extend(_config.map, parameters.map);
        }

        // check initial state
        if (EXT.getState(_mapStorageIdentifier) === 'true') {
            _isMapActivated = true;

            EXT.loadScript();
        } else {
            EXT.hideCanvasElements();
        }

        EXT.initEventListener();

        // handle global checkbox
        if (_config.map.switchElement && $(_config.map.switchElement).length) {
            $(_config.map.switchElement).prop('checked', EXT.getState(_mapStorageIdentifier) === 'true');
        }

        return this;
    };

    /**
     * Load map script and run callback
     * @return this
     */
    EXT.loadScript = function(){
        (function (win, $) {
            $.getScript($(_config.map.scriptUrlSelector).attr('data-url'))
                .done(function () {

                    _config.map.debug ? console.log('[' + _namespace + '] loading script: ' + $(_config.map.scriptUrlSelector).attr('data-url')): '';
                    _config.map.debug ? console.log('[' + _namespace + '] map script loaded'): '';

                    _config.map.callback();
                });
        })(window, jQuery);
    };

    /**
     * Initialize event listener for global checkbox and canvas hints
     */
    EXT.initEventListener = function(){

        if (_config.map.switchElement && _config.map.useGlobal) {
            $(_config.map.switchElement).unbind();
            $(_config.map.switchElement).change(function (event) {
                _config.map.debug ? console.log('[' + _namespace + '] switch maps representation state to: ' + $(this).is(":checked")): '';

                EXT.setState(_mapStorageIdentifier,$(this).is(":checked"));

                if ($(this).is(":checked")) {
                    EXT.loadScript();
                }
            });
        }


        // Event listener for canvas hint elements
        if ($(_selectorCanvasHint).length) {
            $(_selectorCanvasHint).unbind();
            $(_selectorCanvasHint).on('click', function (event) {
                if (!_isMapActivated) {
                    _config.map.debug ? console.log('[' + _namespace + '] activate maps representation by clicking the hint'): '';

                    $(_selectorCanvasHint).fadeOut(function () {
                        $(this).remove();
                    });

                    EXT.loadScript();
                    _isMapActivated = true;


                    if (_config.map.useGlobal) {
                        EXT.setState(_mapStorageIdentifier, true);
                        $(_config.map.switchElement).prop('checked', EXT.getState(_mapStorageIdentifier) === 'true');
                    }
                }
            });
        }
    };

    /**
     * Hiding map canvas element and display a usage hint
     */
    EXT.hideCanvasElements = function(){
        if (!_isMapActivated) {
            $.each(_config.map.canvasElements, function (key, selector) {
                if ($(selector).length) {
                    $(selector).css('background-color', _config.map.canvasHint.style.backgroundColor);
                    $(selector).css('color', _config.map.canvasHint.style.textColor);
                    $(selector).css('font-size', _config.map.canvasHint.style.textSize);
                    $(selector).hover(function() {
                        $(this).css("cursor","pointer")
                    });

                    var _icon = _config.map.canvasHint.style.iconUrl ? '<img src="' + _config.map.canvasHint.style.iconUrl + '" style="width: 50px; margin-bottom: 20px;" alt="Forbidden map" />' : _svgIcon;

                    var _html = '<div class="' + _classCanvasHint + ' ' + _config.map.canvasHint.className + '" style="position: absolute; width: 200px; height: 200px; top: 50%; left: 50%; margin-top: -100px; margin-left: -100px; text-align: center">' +
                        _icon +
                        '<div class="' + _classCanvasHint + '-body">' +
                        _config.map.canvasHint.msg +
                        '</div>' +
                        '</div>';
                    $(selector).append(_html);

                    EXT.initEventListener();
                }
            });
        }
    };

    /**
     * Storing the state with HTML Local Storage
     *
     * @param identifier
     * @param state
     * @return {boolean}
     */
    EXT.setState = function(identifier, state){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(identifier, state);
            return true;
        } else {
            _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage'): '';
            return false;
        }
    };

    /**
     *
     * @param identifier
     * @returns {*}
     */
    EXT.getState = function(identifier) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(identifier);
        } else {
            _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage'): '';
            return false;
        }
    };

    return EXT;

})(window, document, jQuery);
