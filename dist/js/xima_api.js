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

window.initOverlappingMarkerSpiderfier = (function(){/*
 OverlappingMarkerSpiderfier
https://github.com/jawj/OverlappingMarkerSpiderfier
Copyright (c) 2011 - 2012 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
Note: The Google Maps API v3 must be included *before* this code
*/
    var h=!0,u=null,v=!1;
    (function(){var A,B={}.hasOwnProperty,C=[].slice;if(((A=this.google)!=u?A.maps:void 0)!=u)this.OverlappingMarkerSpiderfier=function(){function w(b,d){var a,g,f,e,c=this;this.map=b;d==u&&(d={});for(a in d)B.call(d,a)&&(g=d[a],this[a]=g);this.e=new this.constructor.g(this.map);this.n();this.b={};e=["click","zoom_changed","maptypeid_changed"];g=0;for(f=e.length;g<f;g++)a=e[g],p.addListener(this.map,a,function(){return c.unspiderfy()})}var p,s,t,q,k,c,y,z;c=w.prototype;z=[w,c];q=0;for(k=z.length;q<k;q++)t=
        z[q],t.VERSION="0.3.3";s=google.maps;p=s.event;k=s.MapTypeId;y=2*Math.PI;c.keepSpiderfied=v;c.markersWontHide=v;c.markersWontMove=v;c.nearbyDistance=20;c.circleSpiralSwitchover=9;c.circleFootSeparation=23;c.circleStartAngle=y/12;c.spiralFootSeparation=26;c.spiralLengthStart=11;c.spiralLengthFactor=4;c.spiderfiedZIndex=1E3;c.usualLegZIndex=10;c.highlightedLegZIndex=20;c.legWeight=1.5;c.legColors={usual:{},highlighted:{}};q=c.legColors.usual;t=c.legColors.highlighted;q[k.HYBRID]=q[k.SATELLITE]="#fff";
        t[k.HYBRID]=t[k.SATELLITE]="#f00";q[k.TERRAIN]=q[k.ROADMAP]="#444";t[k.TERRAIN]=t[k.ROADMAP]="#f00";c.n=function(){this.a=[];this.j=[]};c.addMarker=function(b){var d,a=this;if(b._oms!=u)return this;b._oms=h;d=[p.addListener(b,"click",function(d){return a.F(b,d)})];this.markersWontHide||d.push(p.addListener(b,"visible_changed",function(){return a.o(b,v)}));this.markersWontMove||d.push(p.addListener(b,"position_changed",function(){return a.o(b,h)}));this.j.push(d);this.a.push(b);return this};c.o=function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d){if(b._omsData!=u&&(d||!b.getVisible())&&!(this.s!=u||this.t!=u))return this.unspiderfy(d?b:u)};c.getMarkers=function(){return this.a.slice(0)};c.removeMarker=function(b){var d,a,g,f,e;b._omsData!=u&&this.unspiderfy();d=this.m(this.a,b);if(0>d)return this;g=this.j.splice(d,1)[0];f=0;for(e=g.length;f<e;f++)a=g[f],p.removeListener(a);delete b._oms;this.a.splice(d,1);return this};c.clearMarkers=function(){var b,d,a,g,f,e,c,m;this.unspiderfy();m=this.a;b=g=0;for(e=m.length;g<e;b=++g){a=m[b];d=this.j[b];
            f=0;for(c=d.length;f<c;f++)b=d[f],p.removeListener(b);delete a._oms}this.n();return this};c.addListener=function(b,d){var a,g;((g=(a=this.b)[b])!=u?g:a[b]=[]).push(d);return this};c.removeListener=function(b,d){var a;a=this.m(this.b[b],d);0>a||this.b[b].splice(a,1);return this};c.clearListeners=function(b){this.b[b]=[];return this};c.trigger=function(){var b,d,a,g,f,e;d=arguments[0];b=2<=arguments.length?C.call(arguments,1):[];d=(a=this.b[d])!=u?a:[];e=[];g=0;for(f=d.length;g<f;g++)a=d[g],e.push(a.apply(u,
            b));return e};c.u=function(b,d){var a,g,f,e,c;f=this.circleFootSeparation*(2+b)/y;g=y/b;c=[];for(a=e=0;0<=b?e<b:e>b;a=0<=b?++e:--e)a=this.circleStartAngle+a*g,c.push(new s.Point(d.x+f*Math.cos(a),d.y+f*Math.sin(a)));return c};c.v=function(b,d){var a,g,f,e,c;f=this.spiralLengthStart;a=0;c=[];for(g=e=0;0<=b?e<b:e>b;g=0<=b?++e:--e)a+=this.spiralFootSeparation/f+5E-4*g,g=new s.Point(d.x+f*Math.cos(a),d.y+f*Math.sin(a)),f+=y*this.spiralLengthFactor/a,c.push(g);return c};c.F=function(b,d){var a,g,f,e,c,
            m,l,x,n;e=b._omsData!=u;(!e||!this.keepSpiderfied)&&this.unspiderfy();if(e||this.map.getStreetView().getVisible()||"GoogleEarthAPI"===this.map.getMapTypeId())return this.trigger("click",b,d);e=[];c=[];a=this.nearbyDistance;m=a*a;f=this.c(b.position);n=this.a;l=0;for(x=n.length;l<x;l++)a=n[l],a.map!=u&&a.getVisible()&&(g=this.c(a.position),this.f(g,f)<m?e.push({A:a,p:g}):c.push(a));return 1===e.length?this.trigger("click",b,d):this.G(e,c)};c.markersNearMarker=function(b,d){var a,g,f,e,c,m,l,x,n,p;
            d==u&&(d=v);if(this.e.getProjection()==u)throw"Must wait for 'idle' event on map before calling markersNearMarker";a=this.nearbyDistance;c=a*a;f=this.c(b.position);e=[];x=this.a;m=0;for(l=x.length;m<l;m++)if(a=x[m],!(a===b||a.map==u||!a.getVisible()))if(g=this.c((n=(p=a._omsData)!=u?p.l:void 0)!=u?n:a.position),this.f(g,f)<c&&(e.push(a),d))break;return e};c.markersNearAnyOtherMarker=function(){var b,d,a,g,c,e,r,m,l,p,n,k;if(this.e.getProjection()==u)throw"Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";
            e=this.nearbyDistance;b=e*e;g=this.a;e=[];n=0;for(a=g.length;n<a;n++)d=g[n],e.push({q:this.c((r=(l=d._omsData)!=u?l.l:void 0)!=u?r:d.position),d:v});n=this.a;d=r=0;for(l=n.length;r<l;d=++r)if(a=n[d],a.map!=u&&a.getVisible()&&(g=e[d],!g.d)){k=this.a;a=m=0;for(p=k.length;m<p;a=++m)if(c=k[a],a!==d&&(c.map!=u&&c.getVisible())&&(c=e[a],(!(a<d)||c.d)&&this.f(g.q,c.q)<b)){g.d=c.d=h;break}}n=this.a;a=[];b=r=0;for(l=n.length;r<l;b=++r)d=n[b],e[b].d&&a.push(d);return a};c.z=function(b){var d=this;return{h:function(){return b._omsData.i.setOptions({strokeColor:d.legColors.highlighted[d.map.mapTypeId],
                zIndex:d.highlightedLegZIndex})},k:function(){return b._omsData.i.setOptions({strokeColor:d.legColors.usual[d.map.mapTypeId],zIndex:d.usualLegZIndex})}}};c.G=function(b,d){var a,c,f,e,r,m,l,k,n,q;this.s=h;q=b.length;a=this.C(function(){var a,d,c;c=[];a=0;for(d=b.length;a<d;a++)k=b[a],c.push(k.p);return c}());e=q>=this.circleSpiralSwitchover?this.v(q,a).reverse():this.u(q,a);a=function(){var a,d,k,q=this;k=[];a=0;for(d=e.length;a<d;a++)f=e[a],c=this.D(f),n=this.B(b,function(a){return q.f(a.p,f)}),
            l=n.A,m=new s.Polyline({map:this.map,path:[l.position,c],strokeColor:this.legColors.usual[this.map.mapTypeId],strokeWeight:this.legWeight,zIndex:this.usualLegZIndex}),l._omsData={l:l.position,i:m},this.legColors.highlighted[this.map.mapTypeId]!==this.legColors.usual[this.map.mapTypeId]&&(r=this.z(l),l._omsData.w={h:p.addListener(l,"mouseover",r.h),k:p.addListener(l,"mouseout",r.k)}),l.setPosition(c),l.setZIndex(Math.round(this.spiderfiedZIndex+f.y)),k.push(l);return k}.call(this);delete this.s;this.r=
            h;return this.trigger("spiderfy",a,d)};c.unspiderfy=function(b){var d,a,c,f,e,k,m;b==u&&(b=u);if(this.r==u)return this;this.t=h;f=[];c=[];m=this.a;e=0;for(k=m.length;e<k;e++)a=m[e],a._omsData!=u?(a._omsData.i.setMap(u),a!==b&&a.setPosition(a._omsData.l),a.setZIndex(u),d=a._omsData.w,d!=u&&(p.removeListener(d.h),p.removeListener(d.k)),delete a._omsData,f.push(a)):c.push(a);delete this.t;delete this.r;this.trigger("unspiderfy",f,c);return this};c.f=function(b,d){var a,c;a=b.x-d.x;c=b.y-d.y;return a*
            a+c*c};c.C=function(b){var d,a,c,f,e;f=a=c=0;for(e=b.length;f<e;f++)d=b[f],a+=d.x,c+=d.y;b=b.length;return new s.Point(a/b,c/b)};c.c=function(b){return this.e.getProjection().fromLatLngToDivPixel(b)};c.D=function(b){return this.e.getProjection().fromDivPixelToLatLng(b)};c.B=function(b,c){var a,g,f,e,k,m;f=k=0;for(m=b.length;k<m;f=++k)if(e=b[f],e=c(e),"undefined"===typeof a||a===u||e<g)g=e,a=f;return b.splice(a,1)[0]};c.m=function(b,c){var a,g,f,e;if(b.indexOf!=u)return b.indexOf(c);a=f=0;for(e=b.length;f<
        e;a=++f)if(g=b[a],g===c)return a;return-1};w.g=function(b){return this.setMap(b)};w.g.prototype=new s.OverlayView;w.g.prototype.draw=function(){};return w}()}).call(this);});
/* Tue 7 May 2013 14:56:02 BST */

/**
 * xm_dsgvo.js – A javascript to handle privacy conform user interaction with maps
 *
 * @author Konrad Michalik <kmi@xima.de>
 * @version 1.0.0
 *
 *
 */
XIMA.api.dsgvo = (function (window, document, $, undefined) {

    var EXT = {};

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
            // enable maps activation for canvas elements
            useCanvasHint: true,
            // use checkbox to switch global setting
            switchElement: null,
            // map canvas elements
            canvasElements: [],
            // callback
            callback: function () {

            },
            // styling
            canvasHint: {
                // canvas hint message
                msg: 'Karten sind standardmäßig deaktiviert. Klicken Sie hier, um den Datenschutzbestimmungen zuzustimmen und die Karte anzeigen zu lassen.',
                // canvas hint custom styling
                style: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    textColor: '#dddddd',
                    textSize: '12px',
                    iconUrl: null
                },
                // optional class for canvas hint
                className: null
            }
        }
    };


    var _selectorCanvasHint = '.' + _config.map.canvasHint.className;

    // default svg map icon
    var _svgIcon = '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'><svg enable-background="new 0 0 26 26" id="map" version="1.1" viewBox="0 0 26 26" width="100px" height="100px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M24.9021606,21.0473633c0.0229492-0.0432129,0.0421753-0.0855103,0.0563354-0.1323242   c0.0135498-0.0444336,0.0206909-0.088562,0.0258179-0.1355591c0.0056152-0.0511475,0.0065308-0.1004639,0.0014038-0.1525879   c-0.0022583-0.0233154,0.005127-0.0452881,0.0006104-0.0687866l-1.8310547-9.4819336   c-0.0066528-0.0340576-0.0269165-0.0604248-0.0377197-0.0924072c-0.010498-0.0315552-0.0098267-0.0643921-0.0247803-0.0950928   c-0.0075684-0.0155029-0.0216675-0.0246582-0.0301514-0.0393677c-0.0272217-0.0478516-0.0612183-0.0872192-0.0975342-0.1273193   c-0.0292358-0.0321655-0.0559082-0.0645752-0.0897827-0.0908203c-0.0409546-0.0319824-0.0859985-0.053894-0.1328735-0.0767212   c-0.0407715-0.0198975-0.0791626-0.0401001-0.1227417-0.0523682c-0.0438843-0.0122681-0.0886841-0.0148926-0.1351318-0.0188599   c-0.053833-0.0049438-0.1057129-0.0080566-0.1601563-0.0009766c-0.0164185,0.0021362-0.0314941-0.003479-0.0480347-0.0003052   c-0.0328979,0.0063477-0.0581665,0.0263672-0.0891113,0.0366821c-0.0322876,0.0108032-0.06604,0.0101929-0.0974121,0.0258179   l-2.7524414,1.345459c0.4395142-0.8766479,0.7983398-1.9657593,0.7983398-3.2058105   c0-3.9213867-3.1787109-7.1137695-7.0927734-7.1342773c-0.0097656,0-0.0175781,0-0.0253906,0s-0.015625,0-0.0253906,0   c-3.9150391,0.0205078-7.09375,3.2128906-7.09375,7.1342773c0,1.2284546,0.3527222,2.30896,0.7872314,3.1819458   l-3.4337158,1.6784058c-0.0142822,0.007019-0.0227051,0.0200806-0.0363159,0.027832   c-0.0516968,0.0290527-0.0952148,0.0656128-0.1384888,0.1061401c-0.0292358,0.0274048-0.0584106,0.0525513-0.0826416,0.0838013   c-0.0309448,0.039978-0.0528564,0.0843506-0.0754395,0.1307983c-0.0216675,0.0441895-0.041748,0.0866699-0.0544434,0.1341553   c-0.0046387,0.0175171-0.0164185,0.0309448-0.0198975,0.0490112l-1.8310547,9.4819336   c-0.0045776,0.0238647,0.0028687,0.0462036,0.0006104,0.0699463c-0.005127,0.0510254-0.0041504,0.1002808,0.0014038,0.1520996   c0.0055542,0.0505371,0.0148315,0.0975952,0.0302124,0.1452026c0.0073853,0.0233154,0.0048218,0.0473022,0.0146484,0.0702515   c0.0126343,0.0294189,0.0331421,0.052002,0.0488892,0.0789185c0.013916,0.0238037,0.0262451,0.046875,0.0426636,0.0689697   c0.046814,0.0631714,0.100769,0.118042,0.1628418,0.1625366c0.0079956,0.0057983,0.0136108,0.0137329,0.0218506,0.019165   c0.0743408,0.0490723,0.1575317,0.0802612,0.2441406,0.1004028c0.0096436,0.0022583,0.0167236,0.0090332,0.0264893,0.0109253   c0.0478516,0.0090942,0.0947876,0.0133057,0.1407471,0.0134277c0.0006104,0,0.0012207,0.0002441,0.0018311,0.0002441   c0.0001221,0,0.0001831-0.000061,0.0003052-0.000061c0.0002441,0,0.0004272,0.000061,0.0006714,0.000061   c0.0962524,0,0.1879883-0.0219116,0.274353-0.0563354c0.0067749-0.0026245,0.013855-0.0013428,0.0205688-0.0042114   l6.730957-2.8847046L17,24.4072266c0.0056763,0.0020142,0.0113525,0.0010986,0.0170288,0.0029297   C17.09198,24.4347534,17.1699219,24.4501953,17.25,24.4501953c0.092041,0,0.1802979-0.0219116,0.2647095-0.0541382   c0.0102539-0.0038452,0.0209961-0.0020752,0.031189-0.0064087l7-3c0.022522-0.0096436,0.0369263-0.0285645,0.0579834-0.0401001   c0.0446777-0.0244141,0.0838623-0.052002,0.1220703-0.0843506c0.0371094-0.0313721,0.0704956-0.0629272,0.1004028-0.1002197   C24.8562012,21.1279297,24.8797607,21.0894165,24.9021606,21.0473633z M4.24646,14.7277222l3.2199707-1.5739136   l1.3627319,1.8533936l-0.5172119,5.0644531l-5.5574341,2.3817749L4.24646,14.7277222z M9.3131714,20.1036987l0.3980103-3.8969116   l2.689209,3.6574707c0.1416016,0.1923828,0.3916016,0.3056641,0.6298828,0.3056641s0.4628906-0.1137695,0.6044922-0.3056641   l2.3893433-3.2503662l0.6206055,6.0773926L9.3131714,20.1036987z M17.6513062,22.7119141l-0.7452393-7.2978516l0.7644653-1.039978   l4.1978149-2.052002l1.5307007,7.9265747L17.6513062,22.7119141z M13.0175781,3.0498047   c3.0996094,0.0068359,5.6181641,2.5317383,5.6181641,5.6342773c0,1.4643555-0.6523438,2.699707-1.2050781,3.484375   c-0.0019531,0.0024414-0.0039063,0.0043945-0.0058594,0.0068359l-4.4072266,5.9956055l-4.3916016-5.9731445   C8.6230469,12.1943359,8.6210938,12.190918,8.6181641,12.1875c-0.5566406-0.7841797-1.2197266-2.0283203-1.2197266-3.503418   C7.3984375,5.581543,9.9179688,3.0566406,13.0175781,3.0498047z" fill="#ffffff"/><path d="M13.0302734,11.847168c1.7412109,0,3.1582031-1.4189453,3.1582031-3.1630859   s-1.4169922-3.1630859-3.1582031-3.1630859c-1.7421875,0-3.1591797,1.4189453-3.1591797,3.1630859   S11.2880859,11.847168,13.0302734,11.847168z M13.0302734,6.5209961c1.1904297,0,2.1582031,0.9702148,2.1582031,2.1630859   s-0.9677734,2.1630859-2.1582031,2.1630859s-2.1591797-0.9702148-2.1591797-2.1630859S11.8398438,6.5209961,13.0302734,6.5209961z" fill="#ffffff"/></g></svg>';

    /**
     * Initialize dsgvo.js
     * @return this
     * @param parameters
     */
    EXT.initialize = function (parameters) {

        // load additional parameters
        if (parameters) {
            jQuery.extend(_config.map, parameters.map);
        }

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
                $.getScript(_url)
                    .done(function () {

                        _config.map.debug ? console.log('[' + _namespace + '] loading script: ' + _url) : '';
                        _config.map.debug ? console.log('[' + _namespace + '] map script loaded') : '';

                        _config.map.callback();
                    })
                    .fail(function( jqxhr, settings, exception ) {
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
            });
        }


        // Event listener for canvas hint elements
        if ($(_selectorCanvasHint).length) {
            $(_selectorCanvasHint).unbind();
            $(_selectorCanvasHint).on('click', function (event) {
                if (!_isMapActivated) {
                    _config.map.debug ? console.log('[' + _namespace + '] activate maps representation by clicking the hint') : '';

                    $(_selectorCanvasHint).fadeOut(function () {
                        $(this).remove();
                    });

                    EXT.loadScript();
                    _isMapActivated = true;


                    if (_config.map.useGlobal) {
                        EXT.setState(_config.map.mapStorageIdentifier, true);
                        $(_config.map.switchElement).prop('checked', EXT.getState(_config.map.mapStorageIdentifier) === 'true');
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
                    $(selector).css('background-color', _config.map.canvasHint.style.backgroundColor);
                    $(selector).css('color', _config.map.canvasHint.style.textColor);
                    $(selector).css('font-size', _config.map.canvasHint.style.textSize);
                    $(selector).hover(function () {
                        $(this).css("cursor", "pointer")
                    });

                    var _icon = _config.map.canvasHint.style.iconUrl ? '<img src="' + _config.map.canvasHint.style.iconUrl + '" style="width: 50px; margin-bottom: 20px;" alt="Forbidden map" />' : _svgIcon;

                    var _html = '<div class="' + _config.map.canvasHint.className + '" style="position: absolute; width: 200px; height: 200px; top: 50%; left: 50%; margin-top: -100px; margin-left: -100px; text-align: center">' +
                        _icon +
                        '<div class="' + _config.map.canvasHint.className + '-body">' +
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
    EXT.setState = function (identifier, state) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(identifier, state);
            return true;
        } else {
            _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage') : '';
            return false;
        }
    };

    /**
     *
     * @param identifier
     * @returns {*}
     */
    EXT.getState = function (identifier) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(identifier);
        } else {
            _config.map.debug ? console.log('[' + _namespace + '] browser doesn\'t support local storage') : '';
            return false;
        }
    };

    return EXT;

})(window, document, jQuery);

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
    EXT.initGoogleMaps = function(useLatLngBounds, useMarkerClusterer){

        EXT.getMapOptions();

        // if already initialized then return
        if (_mapInit === true){ return this; }

        // return if something is missing

        if ( ! _mapCanvas){
            console.log(errors.msg.MissingMapCanvas);
            return this;
        }

        // begin init

        _mapInit = true;

        _map = new google.maps.Map(_mapCanvas, EXT.getMapOptions());
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
    EXT.applyMapData = function(useLatLngBounds, useMarkerClusterer){

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
                if (_map.getZoom() > EXT.getMapOptions.zoom) _map.setZoom(EXT.getMapOptions.zoom);
                google.maps.event.removeListener(listener);
            });
        }
    };

    /**
     * Closes opening Infowindows
     */
    EXT.closeInfoWindows = function()
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
    EXT.setMapOptions = function(options){

        if (options){
            if (EXT.convertDataType(options, _convertRules)){
                _mapOptions = options;
            }
        }
        return this;
    };

    /**
     * Adds further Google-Map-Options
     * @return this
     */
    EXT.addMapOptions = function(options){

        if (options){
            if (EXT.convertDataType(options, _convertRules)){
                jQuery.extend(EXT.getMapOptions, options);
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
    EXT.convertDataType = function(data, convertRules){

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
    EXT.getMapOptions = function(){

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
    EXT.setMapData = function(mapData){

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
    EXT.setMapCanvas = function(mapCanvas){

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
    EXT.addLayers = function(kml){

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
    EXT.removeLayer = function(key){

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
    EXT.addMarker = function(location, title, icon, windowContent){

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
    EXT.setAllMarkersMap = function(map){

        for (var i = _markers.length -1; i >= 0; i--) {
            _markers[i].setMap(map);
        }
        return this;
    };

    /**
     * Removes the markers from the map, but keeps them in the array
     * @return this
     */
    EXT.clearMarkers = function(){
        this.setAllMarkersMap(null);
        return this;
    };

    /**
     * Deletes all markers in the array by removing references to them
     * @return this
     */
    EXT.deleteMarkers = function(){
        this.clearMarkers();
        _markers = [];
        return this;
    };

    /**
     * Shows any markers currently in the array
     * @return this
     */
    EXT.showMarkers = function(){
        if (_map){
            this.setAllMarkersMap(_map);
        }
        return this;
    };

    /**
     * Creates OverlappingMarkerSpiderfier
     * @return this
     */
    EXT.createOverlappingMarkerSpiderfier = function(){

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
    EXT.getOMSOptions = function(){
        return _omsOptions;
    };

    /**
     * Draw new Polyline by coords with options and store it by key
     * @param key Identifier of routecoords in _mapData
     * @param routeCoords JSON of coords. If NULL then it looks into _mapData
     * @param options PolylineOptions for google.maps.Polyline @see https://developers.google.com/maps/documentation/javascript/reference?hl=de-DE#PolylineOptions
     * @return this
     */
    EXT.drawPolyline = function(key, routeCoords, options){

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

    return EXT;

})(window, document, jQuery);

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
