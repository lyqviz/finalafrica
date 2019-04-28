import {csv, select, scaleBand, scaleLinear, 
  scaleOrdinal, event, axisLeft, axisBottom } from 'd3';
var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 50
}

let height = 400 - margin.top - margin.bottom

let width = 800 - margin.left - margin.right

let svg = select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = scaleBand()
  .range([0, width])
  .padding(0.25)

const yPositionScale = scaleLinear()
  .domain([0, 8000])
  .range([height, 0])

const colorScale = scaleOrdinal().range(['#3182bd', '#9ecae1'])

var div = select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

export default function BarChart(data) {
  // console.log(datapoints)

  const years = data.map(d => d.Year)

  xPositionScale.domain(years)

  svg
    .selectAll('.track-graph')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xPositionScale(d.Year))
    .attr('y', d => yPositionScale(d.track_number))
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => height - yPositionScale(d.track_number))
    .attr('fill', '#b379ce')
    .attr('id', function(d, i) {
      return 'Year' + i
    })
    .on('mousemove', function(d) {
      div
        .html('Year: ' + d.Year + '<br>' + 'Track number is: ' + d.track_number)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function(d, i) {
      div.transition().style('opacity', 0.9)
      div
        .html('Year: ' + d.Year + '<br>' + 'Track number is: ' + d.track_number)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px')

      select('#Year' + i)
        .transition()
        .style('stroke', 'white')
        .style('stroke-width', 1.8)
    })
    .on('mouseout', function(d, i) {
      div.transition().style('opacity', 0)
      select('#Year' + i)
        .transition()
        .style('stroke', 'none')
        .style('stroke-width', 0)
    })

  var yAxis = axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  select('.y-axis .domain').remove()

  var xAxis = axisBottom(xPositionScale)
    .tickValues([1975, 1985, 1995, 2005, 2015])

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}

 function topFunction() {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
      }

select('#myBtn').on('click', topFunction)

