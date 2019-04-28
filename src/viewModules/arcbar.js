import {csv, select, scaleBand, scaleLinear, arc, 
  scaleOrdinal, max, event, axisLeft, axisBottom, interpolate } from 'd3';

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let innerRadius = 100
let outerRadius = Math.min(width, height) / 2

let radiusScale = scaleLinear().range([innerRadius, outerRadius])

var angleScale = scaleBand().range([0, Math.PI * 2])

var colorScale = scaleOrdinal()
  .range([
    '#98abc5',
    '#8a89a6',
    '#7b6888',
    '#6b486b',
    '#a05d56',
    '#d0743c',
    '#ff8c00'
  ])

var arcbar = arc()
  .innerRadius(radiusScale(0))
  .outerRadius(d => radiusScale(d.number))
  .startAngle(d => angleScale(d.Year))
  .endAngle(d => angleScale(d.Year) + angleScale.bandwidth())
  .padAngle(0.1)
  .padRadius(innerRadius)

export default function Arcbar(data) {
  data.forEach(d => {
    d.number = +d.number
  })

  let usaDatapoints = data.filter(
    d => d.country === 'United States of America'
  )
  usaDatapoints.push(usaDatapoints[0])

  const usaMax = max(usaDatapoints, d => d.number)
  radiusScale.domain([0, usaMax])

  const usaYears = usaDatapoints.map(d => d.Year)
  angleScale.domain(usaYears)

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  function arcTween(d, i) {
    let interpolate = interpolate(0, d)
    return t => arc(interpolate(t), i)
  }

  holder
    .selectAll('.rect-graph')
    .data(usaDatapoints)
    .enter()
    .append('path')
    .attr('fill', '#8856a7')
    .transition()
    .delay((d, i) => i * 50)
    .duration(500)
    .attr('stroke-width', 3)
    .attrTween('d', arcTween)
    .attr('class', 'numbers')
    .style('visibility', 'hidden')

  let bands = [0, 2000, 4000, 6000, 8000]

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', '#4E4757')
    .attr('class', 'bands')
    .attr('opacity', 0.9)
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d.toLocaleString())
    .attr('class', 'scale-text')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('fill', '#e6e6e6')
    .attr('dy', -3)
    .attr('font-size', 10)
    .style('visibility', 'hidden')

  holder
    .append('text')
    .text('(people in 100)')
    .attr('class', 'unit-text')
    .attr('x', 29)
    .attr('y', -248)
    .attr('fill', '#e6e6e6')
    .attr('font-size', 10)
    .attr('font-weight', 400)
    .attr('text-anchor', 'middle')
    .attr('class', 'unit-text')

  holder
    .append('text')
    .text('Refugee numbers')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 20)
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('class', 'title-text')

  holder
    .selectAll('.country-text')
    .data(usaDatapoints)
    .enter()
    .append('text')
    .text(d => 'hosted by' + '\n' + d.country.match(/\b[A-Z]/g).join(''))
    .attr('x', 0)
    .attr('y', 10)
    .attr('font-size', 20)
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('class', 'country-text')
    .style('visibility', 'hidden')

  // angle text
  holder
    .selectAll('.angle-text')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('fill', '#e6e6e6')
    .attr('font-size', 9)
    .attr('x', 0)
    .attr('y', -radiusScale(8550))
    .attr('class', 'angle-text')
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180 + 4.9
      return `rotate(${degrees})`
    })
    .attr('text-align', 'middle')
    .style('visibility', 'hidden')

  // turn into blank
  select('#nothing').on('stepin', () => {
    console.log('I am step to blank radial!')
    holder.selectAll('.numbers').remove()
    holder.selectAll('.country-text').remove()
    holder.selectAll('.scale-text').remove()
    holder.selectAll('.angle-text').remove()
  })

  // turn into usa
  select('#usa').on('stepin', () => {
    // console.log('I am step to usa')
    let usaDatapoints = data.filter(
      d => d.country === 'United States of America'
    )
    usaDatapoints.push(usaDatapoints[0])

    const usaMax = max(usaDatapoints, d => d.number)
    radiusScale.domain([0, usaMax])

    const usaYears = usaDatapoints.map(d => d.Year)

    angleScale.domain(usaYears)

    holder.selectAll('.numbers').remove()

    holder.selectAll('.country-text').remove()

    holder
      .selectAll('.numbers')
      .data(usaDatapoints)
      .enter()
      .append('path')
      .attr('fill', '#8856a7')
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attrTween('d', arcTween)
      .attr('stroke-width', 3)
      .attr('stroke-width', 3)
      .attr('class', 'numbers')

    holder.selectAll('.bands').remove()

    let bands = [0, 2000, 4000, 6000, 8000]

    holder
      .selectAll('.bands')
      .data(bands)
      .enter()
      .append('circle')
      .attr('r', d => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#4E4757')
      .attr('class', 'bands')
      .attr('opacity', 0.9)
      .attr('cx', 0)
      .attr('cy', 0)
      .lower()

    holder.selectAll('.scale-text').remove()

    holder
      .selectAll('.scale-text')
      .data(bands)
      .enter()
      .append('text')
      .text(d => d.toLocaleString())
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', d => -radiusScale(d))
      .attr('fill', '#e6e6e6')
      .attr('dy', -3)
      .attr('font-size', 10)
      .attr('class', 'scale-text')

    holder.selectAll('.angle-text').remove()

    holder
      .selectAll('.angle-text')
      .data(angleScale.domain())
      .enter()
      .append('text')
      .text(d => d)
      .attr('fill', '#e6e6e6')
      .attr('font-size', 9)
      .attr('x', 0)
      .attr('y', -radiusScale(8550))
      .attr('class', 'angle-text')
      .attr('transform', d => {
        let degrees = (angleScale(d) / Math.PI) * 180 + 4.9
        return `rotate(${degrees})`
      })
      .attr('text-align', 'middle')

    holder.selectAll('.country-text').remove()

    holder
      .selectAll('.country-text')
      .data(usaDatapoints)
      .enter()
      .append('text')
      .text(d => 'hosted by' + '\n' + d.country.match(/\b[A-Z]/g).join(''))
      .attr('x', 0)
      .attr('y', 10)
      .attr('font-size', 20)
      .attr('font-weight', 600)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('class', 'country-text')
  })

  // turn it to China
  select('#china').on('stepin', () => {
    // console.log('I am step into china')
    let chinaDatapoints = data.filter(d => d.country === 'China')
    chinaDatapoints.push(chinaDatapoints[0])

    const chinaMax = max(chinaDatapoints, d => d.number)
    radiusScale.domain([0, usaMax])

    const chinaYears = chinaDatapoints.map(d => d.Year)

    angleScale.domain(chinaYears)

    holder.selectAll('.numbers').remove()

    holder
      .selectAll('.numbers')
      .data(chinaDatapoints)
      .enter()
      .append('path')
      .attr('fill', '#8856a7')
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attr('stroke-width', 3)
      .attrTween('d', arcTween)
      .attr('class', 'numbers')

    holder.selectAll('.country-text').remove()

    holder
      .selectAll('.country-text')
      .data(chinaDatapoints)
      .enter()
      .append('text')
      .text(d => 'hosted by' + '\n' + d.country)
      .attr('x', 0)
      .attr('y', 10)
      .attr('font-size', 20)
      .attr('font-weight', 600)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('class', 'country-text')

    holder.selectAll('.bands').remove()
    holder.selectAll('.scale-text').remove()

    let bands = [0, 2000, 4000, 6000, 8000]

    holder
      .selectAll('.scale-band')
      .data(bands)
      .enter()
      .append('circle')
      .attr('r', d => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#4E4757')
      .attr('class', 'bands')
      .attr('opacity', 0.9)
      .attr('cx', 0)
      .attr('cy', 0)
      .lower()

    holder
      .selectAll('.scale-text')
      .data(bands)
      .enter()
      .append('text')
      .text(d => d.toLocaleString())
      .attr('class', 'scale-text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', d => -radiusScale(d))
      .attr('fill', '#e6e6e6')
      .attr('dy', -3)
      .attr('font-size', 10)

    holder.selectAll('.angle-text').remove()
    holder
      .selectAll('.angle-text')
      .data(angleScale.domain())
      .enter()
      .append('text')
      .text(d => {
        return d
      })
      .attr('fill', '#e6e6e6')
      .attr('class', 'angle-text')
      .attr('font-size', 9)
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', -radiusScale(8550))
      .attr('transform', d => {
        let degrees = (angleScale(d) / Math.PI) * 180 + 4.8
        return `rotate(${degrees})`
      })
      .attr('text-align', 'middle')
  })
}
