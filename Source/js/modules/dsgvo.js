/**
 * xm_dsgvo.js – A javascript to handle privacy conform user interaction with maps
 *
 * @author Konrad Michalik <kmi@xima.de>
 * @version 1.0.0
 * @depends
 *        jQuery 1.4.1
 *
 */
XIMA.api.dsgvo = (function (window, document, $, undefined) {

    var EXT = {};
    var _self = this;

    var _namespace = 'XIMA.api.dsgvo';
    var _isMapActivated = false;

    var _config = {
        map: {
            // enable logging
            debug: false,
            // url of map script, if not set the url will be parsed via the scriptUrlSelector out of the DOM
            scriptUrl: null,
            // selector of map script url element within attribute 'data-url'
            scriptUrlSelector: '.map-script-url',
            // identifier for local storage to set user decision
            mapStorageIdentifier: 'ximaMapState',
            // use global setting for activate/deactivate maps integration
            useGlobal: false,
            // use cookie to store settings (default using localstorage)
            useCookie: false,
            // use touch handling for mobil devices
            useTouchHandling: false,
            // lifetime of cookie
            cookieLifetime: 0,
            // enable maps activation for canvas elements
            useCanvasHint: true,
            // use custom activate element for loading the map, default is using the {canvasHint.className} element
            activationElement: null,
            // use checkbox to switch global setting
            switchElement: null,
            // map canvas elements
            canvasElements: [],
            // callback
            callback: function () {

            },
            // callback for clicking switchElement
            onSwitch: function (state) {

            },
            // callback for activate map
            onActivate: function () {

            },
            // styling
            canvasHint: {
                // canvas hint message
                msg: 'Karten sind standardmäßig deaktiviert. Klicken Sie hier, um den Datenschutzbestimmungen zuzustimmen und die Karte anzeigen zu lassen.',
                // canvas hint custom styling
                style: {
                    // disable all default styles
                    disableStyles: false,
                    // css styling canvas
                    background: 'rgba(0,0,0,0.5)',
                    textColor: '#dddddd',
                    textSize: '12px',
                    hintStyle: 'position: absolute; width: 250px; height: 250px; top: 50%; left: 50%; margin-top: -125px; margin-left: -125px; text-align: center; padding: 10px;',
                    hintBodyStyle: 'margin-top: 10px;',
                    // icon styling
                    disableIcon: false,
                    iconSize: '100px',
                    iconUrl: null
                },
                // class for canvas
                className: 'xima-js-map',
                // class for hint activation state (show/hide hint)
                classNameActivation: 'active',
                // custom template
                template: null
            }
        }
    };

    /**
     * Initialize dsgvo.js
     * @return this
     * @param parameters
     */
    EXT.initialize = function (parameters) {

        // load additional parameters
        if (parameters) {
            jQuery.extend(true, _config.map, parameters.map);
        }

        _config.map.debug ? console.log('[' + _namespace + '] dsgvo.js initialized') : '';

        // check initial state
        if (EXT.getState(_config.map.mapStorageIdentifier) === 'true') {
            _isMapActivated = true;

            EXT.loadScript();
        } else {
            EXT.hideCanvasElements();
        }

        EXT.initEventListener();

        // handle global checkbox
        if (_config.map.switchElement && $(_config.map.switchElement).length) {
            $(_config.map.switchElement).prop('checked', EXT.getState(_config.map.mapStorageIdentifier) === 'true');
        }

        return this;
    };

    /**
     * Load map script and run callback
     * @return this
     */
    EXT.loadScript = function () {

        var _url = '';
        if (_config.map.scriptUrl) {
            _url = _config.map.scriptUrl;
        } else if ($(_config.map.scriptUrlSelector).length) {
            _url = $(_config.map.scriptUrlSelector).attr('data-url');
        } else {
            _config.map.debug ? console.log('[' + _namespace + '] no script url provided') : '';
        }

        if (_url !== '') {
            (function (win, $) {
                _config.map.debug ? console.log('[' + _namespace + '] loading script: ' + _url) : '';

                $.getScript(_url)
                    .done(function () {
                        _config.map.debug ? console.log('[' + _namespace + '] map script loaded') : '';

                        _config.map.callback();
                    })
                    .fail(function (jqxhr, settings, exception) {
                        _config.map.debug ? console.log('[' + _namespace + '] getScript failed') : '';
                    });
            })(window, jQuery);
        }
    };

    /**
     * Initialize event listener for global checkbox and canvas hints
     */
    EXT.initEventListener = function () {

        if (_config.map.switchElement && _config.map.useGlobal) {
            $(_config.map.switchElement).unbind();
            $(_config.map.switchElement).change(function (event) {
                _config.map.debug ? console.log('[' + _namespace + '] switch maps representation state to: ' + $(this).is(":checked")) : '';

                EXT.setState(_config.map.mapStorageIdentifier, $(this).is(":checked"));

                if ($(this).is(":checked")) {
                    EXT.loadScript();
                }

                _config.map.onSwitch($(this).is(":checked"));
            });
        }


        // Event listener for canvas hint elements
        var _selectorActivationElement = _config.map.activationElement || '.' + _config.map.canvasHint.className;
        if ($(_selectorActivationElement).length) {
            $(_selectorActivationElement).unbind();
            $(_selectorActivationElement).on('click touchend', function (event) {

                // only necessary if map isn't activated so far
                if (!_isMapActivated) {

                    // callback for click/touch
                    _config.map.onActivate();

                    // is touch handling activated?
                    if (_config.map.useTouchHandling) {


                        var $hint = $('.' + _config.map.canvasHint.className);
                        // touch or click?
                        if (event.type === 'touchend') {

                            // show hint/tooltip at first touch ..
                            if (!$hint.hasClass(_config.map.canvasHint.classNameActivation)) {
                                $hint.addClass(_config.map.canvasHint.classNameActivation);
                            } else {
                                // .. at second touch show the map!
                                $hint.removeClass(_config.map.canvasHint.classNameActivation);

                                // load map
                                _self.activateMap();

                                return true;
                            }
                        } else {
                            // load map
                            _self.activateMap();
                        }

                        // prevents touch devices to fires 'click' and 'touchend'
                        // https://stackoverflow.com/questions/7018919/how-to-bind-touchstart-and-click-events-but-not-respond-to-both#answer-36452427
                        return false;
                    } else {
                        _self.activateMap();
                    }

                }
            });
        }
    };

    /**
     * Hiding map canvas element and display a usage hint
     */
    EXT.hideCanvasElements = function () {
        if (!_isMapActivated) {
            $.each(_config.map.canvasElements, function (key, selector) {
                if ($(selector).length) {
                    $(selector).addClass(_config.map.canvasHint.className);

                    if (!_config.map.canvasHint.style.disableStyles) {
                        $(selector).css('background', _config.map.canvasHint.style.background);
                        $(selector).css('color', _config.map.canvasHint.style.textColor);
                        $(selector).css('font-size', _config.map.canvasHint.style.textSize);
                        $(selector).hover(function () {
                            $(this).css("cursor", "pointer")
                        });
                    }

                    var _html = _config.map.canvasHint.template;

                    if (_html == null) {

                        // default svg map icon
                        var _svgIcon = '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'><svg enable-background="new 0 0 26 26" id="map" version="1.1" viewBox="0 0 26 26" width="' + _config.map.canvasHint.style.iconSize + '" height="' + _config.map.canvasHint.style.iconSize + '" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M24.9021606,21.0473633c0.0229492-0.0432129,0.0421753-0.0855103,0.0563354-0.1323242   c0.0135498-0.0444336,0.0206909-0.088562,0.0258179-0.1355591c0.0056152-0.0511475,0.0065308-0.1004639,0.0014038-0.1525879   c-0.0022583-0.0233154,0.005127-0.0452881,0.0006104-0.0687866l-1.8310547-9.4819336   c-0.0066528-0.0340576-0.0269165-0.0604248-0.0377197-0.0924072c-0.010498-0.0315552-0.0098267-0.0643921-0.0247803-0.0950928   c-0.0075684-0.0155029-0.0216675-0.0246582-0.0301514-0.0393677c-0.0272217-0.0478516-0.0612183-0.0872192-0.0975342-0.1273193   c-0.0292358-0.0321655-0.0559082-0.0645752-0.0897827-0.0908203c-0.0409546-0.0319824-0.0859985-0.053894-0.1328735-0.0767212   c-0.0407715-0.0198975-0.0791626-0.0401001-0.1227417-0.0523682c-0.0438843-0.0122681-0.0886841-0.0148926-0.1351318-0.0188599   c-0.053833-0.0049438-0.1057129-0.0080566-0.1601563-0.0009766c-0.0164185,0.0021362-0.0314941-0.003479-0.0480347-0.0003052   c-0.0328979,0.0063477-0.0581665,0.0263672-0.0891113,0.0366821c-0.0322876,0.0108032-0.06604,0.0101929-0.0974121,0.0258179   l-2.7524414,1.345459c0.4395142-0.8766479,0.7983398-1.9657593,0.7983398-3.2058105   c0-3.9213867-3.1787109-7.1137695-7.0927734-7.1342773c-0.0097656,0-0.0175781,0-0.0253906,0s-0.015625,0-0.0253906,0   c-3.9150391,0.0205078-7.09375,3.2128906-7.09375,7.1342773c0,1.2284546,0.3527222,2.30896,0.7872314,3.1819458   l-3.4337158,1.6784058c-0.0142822,0.007019-0.0227051,0.0200806-0.0363159,0.027832   c-0.0516968,0.0290527-0.0952148,0.0656128-0.1384888,0.1061401c-0.0292358,0.0274048-0.0584106,0.0525513-0.0826416,0.0838013   c-0.0309448,0.039978-0.0528564,0.0843506-0.0754395,0.1307983c-0.0216675,0.0441895-0.041748,0.0866699-0.0544434,0.1341553   c-0.0046387,0.0175171-0.0164185,0.0309448-0.0198975,0.0490112l-1.8310547,9.4819336   c-0.0045776,0.0238647,0.0028687,0.0462036,0.0006104,0.0699463c-0.005127,0.0510254-0.0041504,0.1002808,0.0014038,0.1520996   c0.0055542,0.0505371,0.0148315,0.0975952,0.0302124,0.1452026c0.0073853,0.0233154,0.0048218,0.0473022,0.0146484,0.0702515   c0.0126343,0.0294189,0.0331421,0.052002,0.0488892,0.0789185c0.013916,0.0238037,0.0262451,0.046875,0.0426636,0.0689697   c0.046814,0.0631714,0.100769,0.118042,0.1628418,0.1625366c0.0079956,0.0057983,0.0136108,0.0137329,0.0218506,0.019165   c0.0743408,0.0490723,0.1575317,0.0802612,0.2441406,0.1004028c0.0096436,0.0022583,0.0167236,0.0090332,0.0264893,0.0109253   c0.0478516,0.0090942,0.0947876,0.0133057,0.1407471,0.0134277c0.0006104,0,0.0012207,0.0002441,0.0018311,0.0002441   c0.0001221,0,0.0001831-0.000061,0.0003052-0.000061c0.0002441,0,0.0004272,0.000061,0.0006714,0.000061   c0.0962524,0,0.1879883-0.0219116,0.274353-0.0563354c0.0067749-0.0026245,0.013855-0.0013428,0.0205688-0.0042114   l6.730957-2.8847046L17,24.4072266c0.0056763,0.0020142,0.0113525,0.0010986,0.0170288,0.0029297   C17.09198,24.4347534,17.1699219,24.4501953,17.25,24.4501953c0.092041,0,0.1802979-0.0219116,0.2647095-0.0541382   c0.0102539-0.0038452,0.0209961-0.0020752,0.031189-0.0064087l7-3c0.022522-0.0096436,0.0369263-0.0285645,0.0579834-0.0401001   c0.0446777-0.0244141,0.0838623-0.052002,0.1220703-0.0843506c0.0371094-0.0313721,0.0704956-0.0629272,0.1004028-0.1002197   C24.8562012,21.1279297,24.8797607,21.0894165,24.9021606,21.0473633z M4.24646,14.7277222l3.2199707-1.5739136   l1.3627319,1.8533936l-0.5172119,5.0644531l-5.5574341,2.3817749L4.24646,14.7277222z M9.3131714,20.1036987l0.3980103-3.8969116   l2.689209,3.6574707c0.1416016,0.1923828,0.3916016,0.3056641,0.6298828,0.3056641s0.4628906-0.1137695,0.6044922-0.3056641   l2.3893433-3.2503662l0.6206055,6.0773926L9.3131714,20.1036987z M17.6513062,22.7119141l-0.7452393-7.2978516l0.7644653-1.039978   l4.1978149-2.052002l1.5307007,7.9265747L17.6513062,22.7119141z M13.0175781,3.0498047   c3.0996094,0.0068359,5.6181641,2.5317383,5.6181641,5.6342773c0,1.4643555-0.6523438,2.699707-1.2050781,3.484375   c-0.0019531,0.0024414-0.0039063,0.0043945-0.0058594,0.0068359l-4.4072266,5.9956055l-4.3916016-5.9731445   C8.6230469,12.1943359,8.6210938,12.190918,8.6181641,12.1875c-0.5566406-0.7841797-1.2197266-2.0283203-1.2197266-3.503418   C7.3984375,5.581543,9.9179688,3.0566406,13.0175781,3.0498047z" fill="#ffffff"/><path d="M13.0302734,11.847168c1.7412109,0,3.1582031-1.4189453,3.1582031-3.1630859   s-1.4169922-3.1630859-3.1582031-3.1630859c-1.7421875,0-3.1591797,1.4189453-3.1591797,3.1630859   S11.2880859,11.847168,13.0302734,11.847168z M13.0302734,6.5209961c1.1904297,0,2.1582031,0.9702148,2.1582031,2.1630859   s-0.9677734,2.1630859-2.1582031,2.1630859s-2.1591797-0.9702148-2.1591797-2.1630859S11.8398438,6.5209961,13.0302734,6.5209961z" fill="#ffffff"/></g></svg>';


                        // preparing icon
                        var _icon = _config.map.canvasHint.style.disableIcon ?
                            '' :
                            (_config.map.canvasHint.style.iconUrl ?
                                '<img src="' + _config.map.canvasHint.style.iconUrl + '" style="width: ' + _config.map.canvasHint.style.iconSize + ';" alt="Forbidden map" />' :
                                _svgIcon);
                        
                        var hintStyle = _config.map.canvasHint.style.disableStyles ? '' : _config.map.canvasHint.style.hintStyle;
                        var hintBodyStyle = _config.map.canvasHint.style.disableStyles ? '' : _config.map.canvasHint.style.hintBodyStyle;

                        // preparing default template
                        _html = '<div class="' + _config.map.canvasHint.className + '-hint" style="' + hintStyle +'">' +
                        _icon +
                        '<div class="' + _config.map.canvasHint.className + '-hint-body" style="' + hintBodyStyle +'">' +
                            _config.map.canvasHint.msg +
                            '</div>' +
                            '</div>';
                    }

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
    EXT.setState = function (identifier, state) {
        if (_config.map.useCookie) {
            _self.createCookie(
                identifier,
                state,
                _config.map.cookieLifetime
            );
        } else {
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem(identifier, state);
                return true;
            } else {
                _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage') : '';
                return false;
            }
        }
    };

    /**
     *
     * @param identifier
     * @returns {*}
     */
    EXT.getState = function (identifier) {
        if (_config.map.useCookie) {
            _self.getCookie(identifier);
        } else {
            if (typeof (Storage) !== "undefined") {
                return localStorage.getItem(identifier);
            } else {
                _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage') : '';
                return false;
            }
        }

    };

    /**
     * Preparing the map activation
     */
    _self.activateMap = function () {

        _config.map.debug ? console.log('[' + _namespace + '] activate maps representation by clicking/touching activation element') : '';

        $('.' + _config.map.canvasHint.className + '-hint').fadeOut(function () {
            $(this).remove();
        });

        EXT.loadScript();
        _isMapActivated = true;


        if (_config.map.useGlobal) {
            EXT.setState(_config.map.mapStorageIdentifier, true);
            $(_config.map.switchElement).prop('checked', EXT.getState(_config.map.mapStorageIdentifier) === 'true');
        }
    };

    /**
     *
     * @param name
     * @param value
     * @param lifetime
     */
    _self.createCookie = function (name, value, lifetime) {
        var expires;
        if (lifetime) {
            var date = new Date();
            date.setTime(date.getTime() + (lifetime));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    /**
     *
     * @param name
     * @returns {*}
     */
    _self.getCookie = function (name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=");
            if (c_start !== -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end === -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    };

    return EXT;

})(window, document, jQuery);
