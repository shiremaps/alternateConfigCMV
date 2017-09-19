define([
    'esri/units',
    'esri/geometry/Extent',
    'esri/config',
    /*'esri/urlUtils',*/
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'gis/plugins/Google',
    'dojo/i18n!./nls/main',
    'dojo/topic',
    'dojo/sniff'
], function (units, Extent, esriConfig, /*urlUtils,*/ GeometryService, ImageParameters, GoogleMapsLoader, i18n, topic, has) {

    // url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
    esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
    esriConfig.defaults.io.alwaysUseProxy = false;

    esriConfig.defaults.geometryService = new GeometryService('https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

    // Use your own Google Maps API Key.
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    GoogleMapsLoader.KEY = '#';


    function buildImageParameters (config) {
        config = config || {};
        var ip = new ImageParameters();
        //image parameters for dynamic services, set to png32 for higher quality exports
        ip.format = 'png32';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                ip[key] = config[key];
            }
        }
        return ip;
    }

//
//    
//    //some example topics for listening to menu item clicks
//    //these topics publish a simple message to the growler
//    //in a real world example, these topics would be used
//    //in their own widget to listen for layer menu click events
//    topic.subscribe('layerControl/hello', function (event) {
//        topic.publish('growler/growl', {
//            title: 'Hello!',
//            message: event.layer._titleForLegend + ' ' +
//                (event.subLayer ? event.subLayer.name : '') +
//                ' says hello'
//        });
//    });
//    topic.subscribe('layerControl/goodbye', function (event) {
//        topic.publish('growler/growl', {
//            title: 'Goodbye!',
//            message: event.layer._titleForLegend + ' ' +
//                (event.subLayer ? event.subLayer.name : '') +
//                ' says goodbye'
//        });
//    });

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap: 'topo',
            //center: [-122.616, 38.21],//38.21  -85.75 -122.616
            zoom: 12,
            sliderStyle: 'small',
			extent: new Extent({
				xmin: -120,
				ymin: 39.36,
				xmax: -119.55,
				ymax: 39.7,
				spatialReference: {
					wkid: 4326
				}
			})
        },

     
        panes: {
            left: {
                //collapsible: true,
                style: 'display:none'
            },
			right: {
         		id: 'sidebarRight',
         		placeAt: 'outer',
         		region: 'right',
         		splitter: true,
         		collapsible: true
         	},
        },
        collapseButtonsPane: 'outer', //center or outer
        // custom titles
        titles: {
            header: 'Lands',
            subHeader: 'just an example',
            pageTitle: 'easy config'
        },

        layout: {
            //sidebar: 'mobile'
        },

     
        operationalLayers: [

		{
            type: 'dynamic',
            url: 'http://wcgisweb.washoecounty.us/arcgis/rest/services/OpenData/MapServer',
            title: 'Open Data',
            options: {
                id: 'opendata',
                opacity: 1,
				imageParameters: buildImageParameters()
            }
        } 

  
      
  
     ],
        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: {
            growler: {
                include: true,
                id: 'growler',
                type: 'layout',
                path: 'gis/dijit/Growler',
                placeAt: document.body,
                options: {
                    style: 'position:absolute;top:15px;' + (has('phone') ? 'left:50%;transform:translate(-50%,0);' : 'right:15px;')
                }
            },

            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'ui',
                path: 'gis/dijit/Basemaps',
                placeAt: 'top-right',
                position: 'first',
                options: 'config/Lbasemaps'
            },
  
            identify: {
                include: true,
                type: 'invisible',
                //placeAt:'yo',
                id: 'identify',
                path: 'gis/dijit/Identify',
                preload: true,
                title: i18n.viewer.widgets.identify,
                options: 'config/identify'
            },            

            mapInfo: {
                include: true,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dec',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },

            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: i18n.viewer.widgets.layerControl,
                iconClass: 'fa-th-list',
                open: true,
				placeAt: 'right',
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true,
                    // create a custom menu entry in all of these feature types
                    // the custom menu item will publish a topic when clicked
                    menu: {
                        feature: [{
                            topic: 'hello',
                            iconClass: 'fa fa-smile-o',
                            label: 'Say Hello'
                        }]
                    },
                    //create a example sub layer menu that will
                    //apply to all layers of type 'dynamic'
                    subLayerMenu: {
                        dynamic: [{
                            topic: 'goodbye',
                            iconClass: 'fa fa-frown-o',
                            label: 'Say goodbye'
                        }]
                    }
                }
            },

            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: false,
				placeAt: 'right',
                path: 'gis/dijit/Draw',
                title: i18n.viewer.widgets.draw,
                iconClass: 'fa-paint-brush',
                open: false,
                position: 4,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Measurement',
                title: i18n.viewer.widgets.measure,
                iconClass: 'fa-expand',
                open: false,
				placeAt: 'right',
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,
                    defaultLengthUnit: units.MILES
                }
            },
			navtools: {
				include: true,
				id: 'navtools',
				type: 'ui',
				//canFloat: true,
				path: 'gis/widgets/NavTools',
				title: 'Navigation Tools',
				//open: false,
				placeAt: 'top-left',
				position: 1,
				options: {
					map: true,
					mapRightClickMenu: true,
					mapClickMode: true
				}
			}			

        }
    };
});
