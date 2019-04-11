import {nest} from 'd3';

function parse(d){
  return {
    Agglomeration_Name:d.Agglomeration_Name,
    Country:d.Country,
    AU_Regions:d.AU_Regions,
    ISO3:d.ISO3,
    value:+d.Density_2015,
    Population_2015:+d.Population_2015
  }
}

export {
	parse
}