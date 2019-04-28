import {csv, select, scaleSqrt, forceCollide, forceX, forceY, 
  forceManyBody, forceSimulation, nest, event} from 'd3'

var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 20
}

let height = 700 - margin.top - margin.bottom

let width = 1000 - margin.left - margin.right

let svg = select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radiusScale = scaleSqrt()
  .domain([0, 140000000])
  .range([2, 100])

var colorScale = scaleSqrt()
  .domain([0, 131621367])
  .range(['#E5D4F3', '#b379ce'])

var div = select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var forceXSeparate = forceX(function(d) {
    if (d.continent === 'Asia') {
      return 280
    } else if (d.continent === 'Europe') {
      return 480
    } else if (d.continent === 'Africa') {
      return 700
    } else if (d.continent === 'South America') {
      return 280
    } else if (d.continent === 'North America') {
      return 480
    } else if (d.continent === 'Oceania') {
      return 700
    }
  })
  .strength(0.1)

var forceYSeparate = forceY(function(d) {
    if (d.continent === 'Asia') {
      return 200
    } else if (d.continent === 'Europe') {
      return 200
    } else if (d.continent === 'Africa') {
      return 200
    } else if (d.continent === 'South America') {
      return 500
    } else if (d.continent === 'North America') {
      return 500
    } else if (d.continent === 'Oceania') {
      return 500
    }
  })
  .strength(0.1)

var forceXCombine = forceX(width / 2).strength(0.08)
var forceYCombine = forceY(height / 2).strength(0.08)

var forceCollide = forceCollide(d => radiusScale(d.total_number) + 5).strength(1)
var forceCharge = forceManyBody().strength(-15)

var simulation = forceSimulation()
  .force('x', forceXCombine)
  .force('y', forceYCombine)
  .force('collide', forceCollide)
  .force('charge', forceCharge)

export default function BubbleChart(data) {

  data.forEach(d => {
    d.total_number = +d.total_number
  })

  var nested = nest()
    .key( d => d.continent)
    .entries(data)

  // make a list of Arab spring countries
  var arabSpring = [
    'Tunisia',
    'Algeria',
    'Jordan',
    'Oman',
    'Egypt',
    'Yemen',
    'Djibouti',
    'Iraq',
    'Bahrain',
    'Libya',
    'Kuwait',
    'Morocco',
    'Mauritania',
    'Lebanon',
    'Saudi Arabia',
    'Syrian Arab Rep.',
    'Iran',
    'Palestinian'
  ]

  var topData = [
    'Afghanistan',
    'Iraq',
    'Syrian Arab Rep.',
    'Ethiopia',
    'Somalia',
    'Sudan',
    'Viet Nam',
    'Angola',
    'Rwanda',
    'Burundi'
  ]

  var circles = svg
    .selectAll('.countries')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d.total_number))
    .attr('opacity', 0.95)
    .attr('class', d => {
      return d.country.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .classed('countries', true)
    .attr('id', function(d, i) {
      return 'country' + i
    })
    .classed('afghanistan', d => {
      if (d.country === 'Afghanistan') {
        return true
      }
    })
    .classed('iraq', d => {
      if (d.country === 'Iraq') {
        return true
      }
    })
    .classed('arab-spring', d => {
      if (arabSpring.indexOf(d.country) !== -1) {
        return true
      }
    })
    .classed('top-ten', d => {
      if (topData.indexOf(d.country) !== -1) {
        return true
      }
    })
    .attr('fill', d => colorScale(d.total_number))
    .on('mousemove', function(d) {
      div
        .html(d.country + '<br>' + d.total_number.toLocaleString())
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function(d, i) {
      div.transition().style('opacity', 0.9)
      div
        .html(d.country + '<br>' + d.total_number.toLocaleString())
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px')
      select('#country' + i)
        .transition()
        .style('stroke', 'white')
        .style('stroke-width', 2.5)
    })
    .on('mouseout', function(d, i) {
      div.transition().style('opacity', 0)
      select('#country' + i)
        .transition()
        .style('stroke', 'none')
        .style('stroke-width', 0)
    })

  svg
    .selectAll('.continent-label')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('font-size', 18)
    .attr('font-weight', 500)
    .attr('class', 'continent-label')
    .attr('x', function(d) {
      if (d.key === 'Asia') {
        return 250
      } else if (d.key === 'Europe') {
        return 500
      } else if (d.key === 'Africa') {
        return 750
      } else if (d.key === 'South America') {
        return 230
      } else if (d.key === 'North America') {
        return 500
      } else if (d.key === 'Oceania') {
        return 750
      }
    })
    .attr('y', function(d) {
      if (d.key === 'Asia') {
        return 0
      } else if (d.key === 'Europe') {
        return 0
      } else if (d.key === 'Africa') {
        return 0
      } else if (d.key === 'South America') {
        return 450
      } else if (d.key === 'North America') {
        return 450
      } else if (d.key === 'Oceania') {
        return 450
      }
    })
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('opacity', 0.7)
    .attr('visibility', 'hidden')

  // add text-label on each circle
  var nodeText = svg
    .selectAll('.countries-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'countries-label')
    .text(d => {
      return d.country + '\n' + d.total_number.toLocaleString()
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', 'white')
    .classed('afghanistan-label', d => {
      if (d.country === 'Afghanistan') {
        return true
      }
    })
    .classed('iraq-label', d => {
      if (d.country === 'Iraq') {
        return true
      }
    })
    .classed('arab-spring-label', d => {
      if (arabSpring.indexOf(d.country) !== -1) {
        return true
      }
    })
    .classed('top-ten-label', d => {
      if (topData.indexOf(d.country) !== -1) {
        return true
      }
    })
    .style('visibility', 'hidden')


  simulation.nodes(data).on('tick', ticked)

  function ticked() {
    circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    nodeText
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  }

  svg
    .selectAll('.legend-entry')
    .append('text')
    .text('legend')
    .attr('x',300)
    .attr('y',200)
    .attr('fill','white')
    .attr('text-anchor', 'middle')

  select('#origin').on('stepin', () => {
    // console.log('I scroll back')
    svg.selectAll('.countries').attr('fill', d => colorScale(d.total_number))
    svg.selectAll('.countries-label').style('visibility', 'hidden')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Asia
  select('#asia').on('stepin', () => {
    // console.log('I scroll down to asia')
    svg
      .selectAll('.arab-spring')
      .transition()
      .attr('fill', d => colorScale(d.total_number))
    svg
      .selectAll('.afghanistan')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.iraq')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'hidden')
    svg
      .selectAll('.iraq-label')
      .transition()
      .style('visibility', 'visible')
      .transition()

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'hidden')

    svg.selectAll('.afghanistan-label').style('visibility', 'visible')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Arab spring
  select('#arab-spring').on('stepin', () => {
    // console.log('I scroll down to arab spring')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', d => colorScale(d.total_number))
    svg
      .selectAll('.arab-spring')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.countries-label')
      .transition()
      .style('visibility', 'hidden')
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'visible')

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'hidden')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to separate bubbles based on continent
  select('#split').on('stepin', () => {
    // console.log('I scroll down to separate step')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', d => colorScale(d.total_number))
    svg.selectAll('.countries-label').style('visibility', 'hidden')

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'visible')

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to show top ten countries in different continent
  select('#split-highlight').on('stepin', () => {
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', d => colorScale(d.total_number))
    svg
      .selectAll('.top-ten')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.top-ten-label')
      .transition()
      .style('visibility', 'visible')
  })
}
