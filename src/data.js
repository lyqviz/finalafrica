import {
	parse
} from './utils';

import {csv} from 'd3';

//Data import and parse
const data = d3.csv('./data/cities.csv', parse); //JS Promise

console.log(data)

data.then(function(rows){

  console.log(rows);

  const city = d3.nest()
    .key(function(d){return d.AU_Regions})
    .key(function(d){return d.Country})
    //.key(function(d){return d.Agglomeration_Name})
    .entries(rows) 

  const rootNode = d3.hierarchy({
    key: 'root',
    values: city
  }, function(d){ return d.values});

  console.log(city)

  renderTree(rootNode, document.getElementById('tree-radial'), true);
});