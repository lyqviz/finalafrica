import {select, scaleOrdinal} from 'd3';

const m = {t:10, r:10, b:10, l:10};

const depthScale = d3.scaleOrdinal()
  .domain([0,1,2,3])
  .range([null, '#c7e9b4', '#41b6c4', '#225ea8']);

export default function renderTree(rootNode, rootDOM, radial){
  
  //const rootDOM = d3.select('#chart1').node();
  const W = rootDOM.clientWidth;
  const H = rootDOM.clientHeight;
  const w = W - m.l - m.r;
  const h = H - m.t - m.b;

  const plot = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .append('g')
    .attr('class','plot')
    .attr('transform', `translate(${m.l}, ${m.t})`);

  const treeTransform = d3.tree()
    .size([w, h]);

  const treeData = treeTransform(rootNode);
  console.log(treeData.descendants());

  const nodesData = treeData.descendants();
  const linksData = treeData.links();

  console.log(rootNode);
  console.log(nodesData);
  console.log(linksData);

  if(!radial){
    const nodes = plot.selectAll('.node')
      .data(nodesData);

    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node');

    nodesEnter.append('circle');
    nodesEnter.append('text');

    nodesEnter.merge(nodes)
      .attr('transform', function(d){
        return `translate(${d.x}, ${d.y})`
      })
      .select('circle')
      .attr('r', 0.1)
      .style('fill', function(d){
        return depthScale(d.depth);
      });

    nodesEnter.merge(nodes)
      .filter(function(d){return d.depth < 2})
      .select('text')
      .text(function(d){ return `${d.data.key}`})
      .attr('dx', 6);

    const links = plot.selectAll('.link')
      .data(linksData)
      .enter()
      .append('path')
      .attr('d', d3.linkRadial()
          .angle(d => d.x)
          .angle(d => d.y));

    const linksEnter = links.enter()
      .insert('line', '.node')
      .attr('class', 'link');

    linksEnter.merge(links)
      .attr('x1', function(d){ return d.source.x })
      .attr('x2', function(d){ return d.target.x })
      .attr('y1', function(d){ return d.source.y })
      .attr('y2', function(d){ return d.target.y });
  }else{

    function polarToCartesian(angle, r){
      return [r * Math.cos(angle), r * Math.sin(angle)]
    }

    plot.attr('transform', `translate(${W/2}, ${H/2})`);

    const nodes = plot.selectAll('.node')
      .data(nodesData);

    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node');

    nodesEnter.append('circle');
    nodesEnter.append('text');

    nodesEnter.merge(nodes)
      .attr('transform', function(d){
        const cartesian = polarToCartesian(d.x/w*Math.PI*2, d.y/2);
        return `translate(${cartesian[0]}, ${cartesian[1]})`
      })
      .select('circle')
      .attr('r', 0.1)
      .style('fill', function(d){
        return depthScale(d.depth);
      });

    nodesEnter.merge(nodes)
      .filter(function(d){ return d.depth < 2})
      .select('text')
      .text(function(d){ return `${d.data.key}: ${d.value}`})
      .attr('dx', 6);

    const links = plot.selectAll('.link')
      .data(linksData);
    const linksEnter = links.enter()
      .insert('line', '.node')
      .attr('class', 'link');

    linksEnter.merge(links)
      .each(function(d){
        const source = polarToCartesian(d.source.x/w*Math.PI*2, d.source.y/2);
        const target = polarToCartesian(d.target.x/w*Math.PI*2, d.target.y/2);

        d3.select(this)
          .attr('x1', function(d){ return source[0] })
          .attr('x2', function(d){ return target[0] })
          .attr('y1', function(d){ return source[1] })
          .attr('y2', function(d){ return target[1] });
      })
  }
  console.groupEnd();
}



