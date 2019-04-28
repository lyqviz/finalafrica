import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
//import {select, max, dispatch} from 'd3';

import {
	allpromise,
	trackpromise,
	continentpromise,
	yearpromise
} from './data';


import {
	parseall,
	parsecontinent,
	parsetotalyear,
  parsetrack
} from './utils';

//View modules
import BarChart from './viewModules/BarChart';
import BubbleChart from './viewModules/BubbleChart';
import LineChart from './viewModules/LineChart';
import Arcbar from './viewModules/Arcbar';

Promise.all([allpromise, trackpromise, continentpromise, yearpromise])
  .then

function renderbarchart(data){
	select('.barchart-container')
	  .each(function(){
	  	BarChart(this, data)
	  })
}

function renderlinechart(data){
	select('.linechart-container')
	  .each(function(){
	  	LineChart(this, data)
	  })
}

function renderbubblechart(data){
	select('.bubblechart-container')
	  .each(function(){
	  	BubbleChart(this, data)
	  })
}

function renderarcbar(data){
	select('.arcbar-container')
	  .each(function(){
	  	Arcbar(this, data)
	  })
}








