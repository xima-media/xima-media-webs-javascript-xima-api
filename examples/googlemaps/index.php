<!DOCTYPE html>
<html>
	<head>
		<title>GoogleMaps Example [xima-api]</title>
		<meta charset="utf-8">
		<style>
			html, body, #map-canvas {
				height: 100%;
				margin: 0px;
				padding: 0px
			}
		</style>
		<!-- dependency -->
		<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?v=3.9&sensor=false"></script>
		<script src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/src/markerclusterer_packed.js"></script>
		<!-- include xima api -->
		<script src="../../js/xima_api.js"></script>
		<script>
			jQuery(document).ready(function($)
			{
				// initiate googlemaps from xima.api
				var myGoogleMaps = new xima.api.googlemaps();

				/**
				 * Your Map-Options
				 * possible Map-Options on https://developers.google.com/maps/documentation/javascript/reference?hl=de-DE#MapOptions
				 */
				var myMapOptions = {
					maxZoom: 13
				};

				/**
				 * Your kml-Files for Map-Layers
				 * Notes on https://developers.google.com/kml/documentation/kmlelementsinmaps?hl=de-DE&csw=1
				 */
				var myKmlFiles = {
					saxony: 'http://symfony.p204765.mittwaldserver.info/bundles/tmgs/sachsen.kml?v=5' // ?v=5 for non-caching behaviour
				};

				// jQuery-Selector where to find data
				var myMapData   = '.map_data';

				// jQuery-Selector where to display GoogleMaps
				var myMapCanvas = '#map-canvas';

				// refer settings
				myGoogleMaps
					.setMapData(myMapData)
					.addMapOptions(myMapOptions)
					.setMapCanvas(myMapCanvas)
					.addLayers(myKmlFiles)
					.initGoogleMaps();

				// init Click-Handler to toggle Map-Markers
				jQuery('#clearMarkers').on('click', function(){
					myGoogleMaps.clearMarkers();
				});
				jQuery('#showMarkers').on('click', function(){
					myGoogleMaps.showMarkers();
				});
			});
		</script>
	</head>
	<body>
		<!-- Map-Controls -->
		<button id="clearMarkers">clear Markers</button>
		<button id="showMarkers">show Markers</button>

		<!-- Hey xima-api, here you can find the map-data -->
		<input class="map_data" type="hidden" value='<?php echo file_get_contents('data/map_data.json'); ?>'>

		<!-- and here I'll see you -->
		<div id="map-canvas"></div>
	</body>
</html>