import React from 'react';

import BaseComponent from './base-component';
import mapboxgl from 'mapbox-gl';
import topojson from 'topojson';
import Aja from 'aja';
import d3 from 'd3';
import {scaleLinear} from 'd3-scale';
import centroid from 'turf-centroid';

import MRAData from '../stores/mra_data';

import AreaDetails from './area-details';
import RentLineChart from './rent-line-chart';


export default class MapElement extends BaseComponent {
  constructor() {
    super();

    //this.colourScale = ['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'];
    this.colourScale = ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']

    this.state = {
      details: {"id":"523402","name":"Otara West","2_plus_bedrooms_required":93,"1_bedroom_required":138,"total_crowded":231,"percent_crowded":39.3,"no_extra_bedrooms_required":"192","1_bedroom_spare":"90","2_plus_bedrooms_spare":"72","total_not_crowded":"354","percent_not_crowded":60.2,"total_stated":"588","total_unknown":63,"total_households":"651","average_household_size":"4.6"},
      marketRentDetails: MRAData.filter((records) => records['SAU'] === 523402)
    }

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

        let layer = this.map.addLayer({
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

    this.map.on('mousemove', this.throttle((event) => {

      let features = this.map.queryRenderedFeatures(event.point, { layers: layersList });
      //
      // MRAs.forEach((id) => {
      //   this.map.setPaintProperty(`market-rent-area-${id}`, "line-color", "transparent");
      // })


      this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (!features.length) {
          popup.remove();
          return;
      }

      let feature = features[0];

      let mraData = MRAData.filter((records) => records['SAU'] === Number(feature.properties.id));

      if(this.state.details.name != feature.properties.name) {
        console.log('setting state for', feature.properties.name);
        this.setState({ details: feature.properties, marketRentDetails: mraData });
      }


      let num = feature.properties.percent_crowded;

      if(!num) {
        num = 0;
      }

      // console.log('Mapping', Mapping[feature.properties.id]);

      // this.map.setPaintProperty(`market-rent-area-${Mapping[feature.properties.id]}`, "line-color", "#27ae60");


      // Populate the popup and set its coordinates
      // based on the feature found.
      /*popup.setLngLat(centroid(feature).geometry.coordinates)
          .setHTML(`${feature.properties.name} - ${d3.format('.2g')(num)}% crowded`)
          .addTo(this.map);*/
    }), 250, this);


    // Aja().method('get')
    //   .url('market_rent.json')
    //   .on('success', (data) => this.loadMarketRentAreas(data))
    //   .go();

  }

  render() {
    let lineChart;

    if(this.state.marketRentDetails.length > 0) {
      lineChart = (<RentLineChart data={this.state.marketRentDetails} areaUnit={this.state.details.name} />);
    }

    return (<div>
      <div id='map'></div>

        <div className='map-scale'>
          <span><span className="percent-crowded-0 scale-box"></span> 0% crowded</span>
          <span><span className="percent-crowded-6 scale-box"></span> 6% crowded</span>
          <span><span className="percent-crowded-12 scale-box"></span> 12% crowded</span>
          <span><span className="percent-crowded-18 scale-box"></span> 18% crowded</span>
          <span><span className="percent-crowded-24 scale-box"></span> 24% crowded</span>
          <span><span className="percent-crowded-30 scale-box"></span> 30% crowded</span>
          <span><span className="percent-crowded-36 scale-box"></span> 36% crowded</span>
          <span><span className="percent-crowded-42 scale-box"></span> 42% crowded</span>
          <span><span className="percent-crowded-48 scale-box"></span> 48%+ crowded</span>
        </div>

      <sidebar>
        <AreaDetails
          details={this.state.details}
          />


        {lineChart}


        <div className='scale'>
          <span><span className='one-bed scale-box'></span> One bedroom</span>
          <span><span className='two-beds scale-box'></span> Two bedrooms</span>
          <span><span className='three-beds scale-box'></span> Three bedrooms</span>
          <span><span className='four-beds scale-box'></span> Four bedrooms</span>
          <span><span className='five-beds scale-box'></span> Five or more bedrooms</span>
        </div>
      </sidebar>


    </div>);
  }


}
