import React from 'react';

import BaseComponent from './base-component';
import mapboxgl from 'mapbox-gl';
import topojson from 'topojson';
import Aja from 'aja';
import d3 from 'd3';
import {scaleLinear} from 'd3-scale';
import centroid from 'turf-centroid';

export default class MapElement extends BaseComponent {
  constructor() {
    super();

    //this.colourScale = ['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'];
    this.colourScale = ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']

    this._bind('loadAreaUnits');
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnpoZXJhbGQiLCJhIjoiSVBPNHM0cyJ9.PDW_j3xU8w-wTnKCpnshPg';

    let zoom = 10;

    this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/nzherald/ciqlmh8sw0004bfnjjtrbxd1l',
        center: [174.7633, -36.8485],
        zoom: zoom,
        minZoom: zoom - 1,
        maxZoom: zoom + 1
      });


    this.map.on('load', () => {



      Aja().method('get')
        .url('area_units.json')
        .on('success', (data) => this.loadAreaUnits(data))
        .go();


    });

  }

  loadMarketRentAreas(data) {
      let features = topojson.feature(data, data.objects.market_rent_area).features;
      let layersList = [];

      features.forEach((marketRentArea) => {

        let layerName = `market-rent-area-${marketRentArea.id}`;

        this.map.addSource(layerName, {
          "type": "geojson",
          "data": marketRentArea
        });

        this.map.addLayer({
          "id": layerName,
          "type": "line",
          "source": layerName,
          "paint": {
            "line-color": "transparent",
            "line-width": 2,
            "line-opacity": 0.8,
            "line-dasharray": [4, 1]
          }
        });

        layersList.push(layerName);
      });
  }

  loadAreaUnits(data) {
    let features = topojson.feature(data, data.objects.area_units).features;
    let vals = features.map((feature) => feature.properties.percent_crowded);

    let scale = scaleLinear().domain([...Array(9).keys()].map((n) => n * 6)).range(this.colourScale);

    let layersList = [];

    features.forEach((areaUnit) => {

      let layerName = `area-unit-${areaUnit.properties.id}`;

      this.map.addSource(layerName, {
        "type": "geojson",
        "data": areaUnit
      });

      let fill = areaUnit.properties.percent_crowded ? scale(areaUnit.properties.percent_crowded) : 'transparent';

      this.map.addLayer({
        "id": layerName,
        "type": "fill",
        "source": layerName,
        "paint": {
            'fill-color': fill,
            //'fill-opacity': 0.5,
            'fill-outline-color': 'rgba(0, 0, 0, 0.5)'
        }
      });

      layersList.push(layerName);
    });

    // Create a popup, but don't add it to the map yet.
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    let map = this.map;

    this.map.on('mousemove', (event) => {

      let features = this.map.queryRenderedFeatures(event.point, { layers: layersList });


      this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (!features.length) {
          popup.remove();
          return;
      }

      let feature = features[0];

      console.log(feature.properties.percent_crowded);

      let num = feature.properties.percent_crowded;

      if(!num) {
        num = 0;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(centroid(feature).geometry.coordinates)
          .setHTML(`${feature.properties.name} - ${d3.format('.2g')(num)}% crowded`)
          .addTo(this.map);
    })


    Aja().method('get')
      .url('market_rent.json')
      .on('success', (data) => this.loadMarketRentAreas(data))
      .go();

  }

  render() {
    return (<div id='map'></div>);
  }


}
