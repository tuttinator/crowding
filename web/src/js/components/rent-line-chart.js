import React from 'react';
import BaseComponent from './base-component';
import d3 from 'd3';
import {timeParse, timeFormat} from 'd3-time-format';
import {scaleTime} from 'd3-scale';

export default class extends BaseComponent {
  constructor(props){
    super(props);
    this._bind('renderChart');
  }

  componentDidMount() {
    this.containerWidth = d3.select('.container').node().getBoundingClientRect().width-20;
    this.renderChart(this.props.data);
  }

  renderChart(data) {
    console.log('renderChart called');
    d3.selectAll(`#rent-chart svg`).remove();

    let tmpChartData = data.filter((d) => d['Property_Type'] == 'House')
    let chartData = [];

    tmpChartData.forEach((row) => {
      let dates = Object.keys(row).filter((key) => key !== 'Bedrooms' && key !== 'Property_Type' && key !== 'SAU')
      dates.forEach((date) => {
        chartData.push({
          date: timeParse('%d/%m/%Y')(date),
          value: row[date],
          bedrooms: row['Bedrooms']
        });
      })
    });

    let combinations = [
      '1 bedroom',
      '2 bedrooms',
      '3 bedrooms',
      '4 bedrooms',
      '5 + bedrooms'
    ]

    let newChartData = combinations.map((rooms, index) => {
      chartData.filter((row) => row.bedrooms == index + 1);

      return {
        id:  index + 1,
        numRooms: rooms,
        values: chartData.filter((row) => row.bedrooms == index + 1).map((row) => {
          return {
            date: row.date,
            value: row.value
          }
        })
      }
    });


    /*
    chartData = d3.nest()
        .key((d) => d.bedrooms)
        .entries(chartData);

    console.log(chartData);*/

    let margin = {top: 10, right: 30, bottom: 30, left: 40};
    let width, height, ticks;

    width = 400;
    height = 200;

    let xScale = scaleTime()
                  .rangeRound([0, width]);

    let yScale = d3.scale.linear()
                  .rangeRound([height, 0]);

    let zScale = d3.scale.ordinal(d3.schemeCategory10);

    zScale.domain(combinations);

    let xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(6)
      .tickFormat(d3.format("g"))
      .tickFormat(timeFormat('%Y'))
      .orient("bottom");

    let yAxis = d3.svg.axis()
      .scale(yScale)
      .innerTickSize(-width)
      .outerTickSize(0)
      .ticks(ticks)
      .orient("left");


    xScale.domain([timeParse('%Y')(1993), timeParse('%Y')(2017)]);

    yScale.domain([0, 1000])


    let line = d3.svg.line()
              .interpolate("basis")
              .x((d) => {
                return xScale(d.date)
              })
              .y((d) => yScale(d.value))


    //debugger;

    let svg = d3.select(`#rent-chart`).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform","translate("+ margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",10)
    .attr("y", -20)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("People");




    svg.select(".y.axis").call(yAxis);
    svg.select(".x.axis").call(xAxis);


    let combin = svg.selectAll(".combination")
        .data(newChartData)
        .enter().append("g")
          .attr("class", "combination");

      combin.append("path")
          .attr("class", "line")
          .attr('fill', 'none')
          .attr("d", function(d) {
            //console.log(d);
            //console.log(line(d.values));
            return line(d.values);
          })
          .style("stroke", (d) => {

            switch(d.numRooms) {
              case '1 bedroom':
                return '#16a085';
                break;
              case '2 bedrooms':
                return '#2980b9';
                break;
              case '3 bedrooms':
                return '#d35400';
                break;
              case '4 bedrooms':
                return '#8e44ad';
                break;
              case '5 + bedrooms':
                return '#2c3e50';
                break;
            }
          });


          /*
    let series = svg.selectAll(".series")
                  .data(newChartData, (d) => d.bedrooms)

    series.attr("class", "line")
          .transition()
          .duration(750)
          .attr("d", line);

    series.enter().append("g")
      .attr("class","series")
      .append("path")
      .attr("class","line")
      .attr("d", (d) => {
        debugger;
        return line(d.values);
      })
      .style("fill","none")
      .style("stroke-width","3.5px");
      //.style("stroke", (d) => d.bedrooms === 2 ? "#FDC130":"#BAD72E");

    series.exit().remove();
    */

  }

  componentWillReceiveProps(nextProps){
    console.log('rerendering')

    if(nextProps.areaUnit !== this.props.areaUnit) {
      this.renderChart(nextProps.data);
    }
  }

  render(){
    return (
      <div id='chart-container'>
        <h5>How rents for houses have changed for this area</h5>

        <div id='rent-chart' className="chart"></div>
      </div>
    );
  }
}
