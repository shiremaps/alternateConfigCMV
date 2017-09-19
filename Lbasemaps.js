define([
    'esri/dijit/Basemap',
    'esri/dijit/BasemapLayer',
    'dojo/i18n!./nls/main'
], function (Basemap, BasemapLayer, i18n) {

    return {
        map: true, // needs a reference to the map
        mode: 'custom', // mut be either 'agol' or 'custom'
		mapStartBasemap: 'topo',

        basemapsToShow: ['washoe', 'satellite','topos'],

        // define all valid basemaps here.
        basemaps: {


            //examples of custom basemaps
		
			washoe: {
                title: 'Washoe',
                basemap: new Basemap({
                    id: 'washoe',
                    layers: [new BasemapLayer({
                        url: 'http://wcgisweb.washoecounty.us/arcgis/rest/services/BaseLayersWebMercator/MapServer'
                    })]
                })
            },            
            satellite: {
                title: 'Satellite',
                basemap: new Basemap({
                    id: 'satellite',
                    layers: [new BasemapLayer({
                        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                    })]
                })
            },
            topos: {
                title: 'Topos',
                basemap: new Basemap({
                    id: 'topos',
                    layers: [new BasemapLayer({
                        url: 'http://wcgisweb.washoecounty.us/arcgis/rest/services/TopoWebMercator/MapServer'
                    })]
                })
            }			


            
        }
    };
});