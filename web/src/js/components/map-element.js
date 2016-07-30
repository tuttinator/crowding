import React from 'react';

import BaseComponent from './base-component';
import mapboxgl from 'mapbox-gl';

export default class MapElement extends BaseComponent {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnpoZXJhbGQiLCJhIjoiSVBPNHM0cyJ9.PDW_j3xU8w-wTnKCpnshPg';

    let zoom = 11;

    this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/nzherald/ciqlmh8sw0004bfnjjtrbxd1l',
        center: [174.7633, -36.8485],
        zoom: zoom,
        minZoom: zoom - 1,
        maxZoom: zoom + 1
      });

    // this.map.on('load', () => {
    //   //this.addPoints();
    //   this.addRoutes();
    //   this.addMarker();
    // });
  }

  render() {
    return (<div id='map'></div>);
  }


}
