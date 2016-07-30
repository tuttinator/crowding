import React from 'react';
import BaseComponent from './base-component';

import d3 from 'd3';


export default class App extends BaseComponent {
  constructor() {
    super();

    this.state = {

    }

    this._bind(;

    this.addEvent(window, 'resize', this.onResize);

    d3.select('body').append('svg')
              .attr('class', 'markers')
              .append('defs').append('marker')
              .attr({
                id: 'arrowhead',
                viewBox: '-10 -10 20 20',
                markerWidth: '20',
                markerHeight: '20',
                orient: 'auto'
              })
             .append('path')
             .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75');

  }

  addEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') { return };

    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
  };

  onResize() {
    this.setState({ viewportWidth: window.document.documentElement.clientWidth });
  }


  render() {
    return (
      <div>
        <BankButtons
          clickHandler={this.selectBank}
          selectedBank={this.state.selectedBank}
          />

        <MapExplainer
          slide={this.state.slide}
          selectSlide={this.selectSlide}
          />

        <div className='map-container'>
          <TAChoropleth
            width={this.state.viewportWidth}
            selectedBank={this.state.selectedBank}
            />

          <TopRegions
            selectedBank={this.state.selectedBank}
            />
        </div>

        <GraphExplainer
          streamSlide={this.state.streamSlide}
          selectStreamSlide={this.selectStreamSlide}
          />

         <Streamgraph
            streamSlide={this.state.streamSlide}
            elementId="stream-graph"
          />

        <Calendar
          width={this.state.viewportWidth}
          data={DailyMortgages}
          elementId="calendar-view"
          selectedBank={this.state.selectedBank}
          />

      </div>
    );
  }
}
