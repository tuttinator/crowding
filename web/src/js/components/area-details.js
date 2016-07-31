import React from 'react';

import BaseComponent from './base-component';
import d3 from 'd3';
import {scaleLinear} from 'd3-scale';

export default class AreaDetails extends BaseComponent {
  render() {

    let table;

    table = (
      <table>
        <tbody>
          <tr>
            <td>2 or more bedrooms required</td>
            <td>{this.props.details['2_plus_bedrooms_required']}</td>
          </tr>
          <tr>
            <td>1 extra bedroom required</td>
            <td>{this.props.details['1_bedroom_required']}</td>
          </tr>
          <tr>
            <td>Total number of crowded households</td>
            <td>{this.props.details.total_crowded}</td>
          </tr>
          <tr>
            <td>Percent crowded</td>
            <td>{d3.format('.2g')(this.props.details.percent_crowded)}%</td>
          </tr>
          <tr>
            <td>No extra bedrooms required</td>
            <td>{this.props.details.no_extra_bedrooms_required}</td>
          </tr>
          <tr>
            <td>1 spare bedroom</td>
            <td>{this.props.details['1_bedroom_spare']}</td>
          </tr>
          <tr>
            <td>2 or more spare bedrooms</td>
            <td>{this.props.details['2_plus_bedrooms_spare']}</td>
          </tr>
          <tr>
            <td>Total not crowded</td>
            <td>{this.props.details.total_not_crowded}</td>
          </tr>
          <tr>
            <td>Percent not crowded</td>
            <td>{d3.format('.2g')(this.props.details.percent_not_crowded)}%</td>
          </tr>
          <tr>
            <td>Total households</td>
            <td>{this.props.details.total_households}</td>
          </tr>
          <tr>
            <td>Average household size</td>
            <td>{this.props.details.average_household_size}</td>
          </tr>
        </tbody>
      </table>
    )

    return(<div id='area-unit-details'>
      <h4>{this.props.details.name}</h4>

      <h4 id='crowded'>{d3.format('.2g')(this.props.details.percent_crowded)}% crowded</h4>

      {table}

    </div>);
  }
}
